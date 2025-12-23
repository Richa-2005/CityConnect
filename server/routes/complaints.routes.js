import express from "express";
import { readJSON, writeJSON } from "../utils/readWriteJSON.js";
import { requireAuth } from "../middleware/auth.js";
import { requireGovOrAuthority } from "../middleware/requireGovOrAuthority.js";

const router = express.Router();

/* =========================
   PUBLIC (Citizen dashboard)
   ========================= */

// GET /complaints?sort=top|new
router.get("/", (req, res) => {
  const sort = String(req.query.sort || "new").toLowerCase();

  let data = readJSON("data/complaints.json");
  if (!Array.isArray(data)) data = [];

  if (sort === "top") {
    data.sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0));
  } else {
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  res.json(data);
});

// POST /complaints (Citizen creates complaint)
router.post("/", requireAuth, (req, res) => {
  const { title, department, area, description, imageUrl } = req.body || {};

  if (!title?.trim() || !department?.trim()) {
    return res.status(400).json({ error: "Title and department are required" });
  }

  const allowedDepts = ["roads", "electricity", "water", "transport", "sanitation", "other", "animal", "general"];
  const dept = String(department).toLowerCase();

  if (!allowedDepts.includes(dept)) {
    return res.status(400).json({ error: "Invalid department" });
  }

  const data = readJSON("data/complaints.json");
  const next = {
    id: `cmp${String(Date.now()).slice(-6)}`, // simple unique id
    title: String(title).trim(),
    description: String(description || "").trim(),
    department: dept,
    area: String(area || "").trim(),
    imageUrl: String(imageUrl || "").trim(),
    votes: 0,
    status: "Open",
    createdBy: req.user.id,
    createdAt: new Date().toISOString(),
  };

  data.push(next);
  writeJSON("data/complaints.json", data);

  res.status(201).json(next);
});

// POST /complaints/:id/vote
router.post("/:id/vote", requireAuth, (req, res) => {
  const { id } = req.params;

  const data = readJSON("data/complaints.json");
  const idx = data.findIndex((c) => c.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });

  data[idx].votes = (data[idx].votes ?? 0) + 1;
  writeJSON("data/complaints.json", data);

  res.json({ id, votes: data[idx].votes });
});

/* =========================
   GOVT + AUTHORITY
   ========================= */

// GET /complaints/gov/list?sort=top|new
router.get("/gov/list", requireAuth, requireGovOrAuthority, (req, res) => {
  const sort = String(req.query.sort || "new").toLowerCase();
  const role = String(req.user?.role || "").toUpperCase();
  const myDept = String(req.user?.department || req.user?.dept || "").toLowerCase();

  let data = readJSON("data/complaints.json");
  if (!Array.isArray(data)) data = [];

  // GOVT sees only their department; AUTHORITY sees all
  if (role === "GOVT") {
    data = data.filter((c) => String(c.department || "").toLowerCase() === myDept);
  }

  if (sort === "top") {
    data.sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0));
  } else {
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  res.json(data);
});

// PATCH /complaints/gov/:id  { status }
router.patch("/gov/:id", requireAuth, requireGovOrAuthority, (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};

  const allowed = ["Open", "In Progress", "Resolved"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const role = String(req.user?.role || "").toUpperCase();
  const myDept = String(req.user?.department || req.user?.dept || "").toLowerCase();

  const data = readJSON("data/complaints.json");
  const idx = data.findIndex((c) => c.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });

  // GOVT can update only their department complaints
  if (role === "GOVT") {
    const cDept = String(data[idx].department || "").toLowerCase();
    if (cDept !== myDept) return res.status(403).json({ error: "Forbidden" });
  }

  data[idx].status = status;
  writeJSON("data/complaints.json", data);

  res.json(data[idx]);
});

export default router;