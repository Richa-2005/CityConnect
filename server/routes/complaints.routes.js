import express from "express";
import { readJSON, writeJSON } from "../utils/readWriteJSON.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roleCheck.js";

const router = express.Router();

function sortComplaints(list, sort) {
  if (sort === "top") return [...list].sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0));
  // default: newest
  return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// PUBLIC FEED
router.get("/", (req, res) => {
  const { sort = "new" } = req.query;
  const complaints = readJSON("data/complaints.json");
  res.json(sortComplaints(complaints, sort));
});

// CITIZEN: CREATE COMPLAINT
router.post("/", requireAuth, requireRole("CITIZEN"), (req, res) => {
  const { title, description = "", department, area = "" } = req.body;
  if (!title || !department) {
    return res.status(400).json({ error: "title and department are required" });
  }

  const complaints = readJSON("data/complaints.json");
  const newComplaint = {
    id: `cmp${String(complaints.length + 1).padStart(3, "0")}`,
    title,
    description,
    department,
    area,
    votes: 0,
    status: "Open",
    createdBy: req.user.id,
    createdAt: new Date().toISOString()
  };

  complaints.push(newComplaint);
  writeJSON("data/complaints.json", complaints);
  res.status(201).json(newComplaint);
});

// CITIZEN: VOTE
router.post("/:id/vote", requireAuth, requireRole("CITIZEN"), (req, res) => {
  const { id } = req.params;
  const complaints = readJSON("data/complaints.json");
  const idx = complaints.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: "Complaint not found" });

  // Minimal demo: increment count (no duplicate protection)
  complaints[idx].votes = (complaints[idx].votes ?? 0) + 1;

  writeJSON("data/complaints.json", complaints);
  res.json({ id, votes: complaints[idx].votes });
});

// GOVT: VIEW COMPLAINTS FOR THEIR DEPT + TOP VOTED
router.get("/gov/list", requireAuth, requireRole("GOVT"), (req, res) => {
  const { sort = "new" } = req.query;
  const complaints = readJSON("data/complaints.json");
  const dept = req.user.department;

  const filtered = complaints.filter(c => c.department === dept);
  res.json(sortComplaints(filtered, sort));
});

// GOVT: UPDATE STATUS (optional but nice)
router.patch("/gov/:id", requireAuth, requireRole("GOVT"), (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowed = ["Open", "In Progress", "Resolved"];

  if (!allowed.includes(status)) return res.status(400).json({ error: `status must be one of ${allowed.join(", ")}` });

  const complaints = readJSON("data/complaints.json");
  const idx = complaints.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: "Complaint not found" });

  // enforce dept ownership
  if (complaints[idx].department !== req.user.department) {
    return res.status(403).json({ error: "Cannot update complaints outside your department" });
  }

  complaints[idx].status = status;
  writeJSON("data/complaints.json", complaints);
  res.json(complaints[idx]);
});

export default router;