import express from "express";
import { readJSON, writeJSON } from "../utils/readWriteJSON.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roleCheck.js";

const router = express.Router();

/**
 * PUBLIC: list projects
 * GET /projects?department=roads&area=CBT&status=Ongoing&sort=new
 */
router.get("/", (req, res) => {
  const { department, area, status, sort = "new" } = req.query;
  let projects = readJSON("data/projects.json");

  if (department) projects = projects.filter(p => p.department === department);
  if (area) projects = projects.filter(p => (p.area || "").toLowerCase().includes(area.toLowerCase()));
  if (status) projects = projects.filter(p => p.status === status);

  projects.sort((a, b) => {
    if (sort === "old") return new Date(a.createdAt) - new Date(b.createdAt);
    return new Date(b.createdAt) - new Date(a.createdAt); // default newest first
  });

  res.json(projects);
});

/**
 * PUBLIC: get one project
 * GET /projects/:id
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const projects = readJSON("data/projects.json");
  const project = projects.find(p => p.id === id);
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(project);
});

/**
 * GOVT: create project
 * POST /projects/gov
 * Header: x-user-id: gov001
 */
router.post("/gov", requireAuth, requireRole("GOVT"), (req, res) => {
  const {
  title,
  department,
  area = "",
  description = "",
  startDate,
  endDate,
  status = "Planned",
  imageUrl = ""
} = req.body;

  if (!title || !startDate || !endDate) {
    return res.status(400).json({ error: "title, startDate, endDate are required" });
  }

  const allowedStatus = ["Planned", "Ongoing", "Completed"];
  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ error: `status must be one of ${allowedStatus.join(", ")}` });
  }

  const projects = readJSON("data/projects.json");
  const newProject = {
    id: `proj${String(projects.length + 1).padStart(3, "0")}`,
    title,
    department: req.user.department || department || "general",
    area,
    description,
    imageUrl,     
    startDate,
    endDate,
    status,
    createdBy: req.user.id,
    createdAt: new Date().toISOString()
  };

  projects.push(newProject);
  writeJSON("data/projects.json", projects);

  res.status(201).json(newProject);
});

/**
 * GOVT: update project (only same department)
 * PATCH /projects/gov/:id
 */
router.patch("/gov/:id", requireAuth, requireRole("GOVT"), (req, res) => {
  const { id } = req.params;
  const projects = readJSON("data/projects.json");
  const idx = projects.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: "Project not found" });

  // enforce: official can edit only their department projects
  const userDept = req.user.department;
  if (userDept && projects[idx].department !== userDept) {
    return res.status(403).json({ error: "Cannot edit projects outside your department" });
  }

  const allowedFields = ["title", "area", "description", "imageUrl", "startDate", "endDate", "status"];
  for (const key of Object.keys(req.body)) {
    if (!allowedFields.includes(key)) continue;
    projects[idx][key] = req.body[key];
  }

  // validate status if updated
  const allowedStatus = ["Planned", "Ongoing", "Completed"];
  if (projects[idx].status && !allowedStatus.includes(projects[idx].status)) {
    return res.status(400).json({ error: `status must be one of ${allowedStatus.join(", ")}` });
  }

const { progressNote = "", progressImageUrl = "" } = req.body;

if (progressNote && progressNote.trim()) {
  if (!Array.isArray(projects[idx].updates)) projects[idx].updates = [];

  projects[idx].updates.unshift({
    note: progressNote.trim(),
    imageUrl: progressImageUrl?.trim() || "",
    by: req.user.id,
    at: new Date().toISOString()
  });

  projects[idx].lastUpdatedAt = new Date().toISOString();
}

  writeJSON("data/projects.json", projects);
  res.json(projects[idx]);
});

export default router;