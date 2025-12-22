// server/routes/alerts.routes.js
import express from "express";
import { readJSON, writeJSON } from "../utils/readWriteJSON.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roleCheck.js";

const router = express.Router();

const SEVERITIES = ["Low", "Medium", "High", "Critical"];
const DEPTS = ["roads", "electricity", "water", "transport", "general"];

function nowISO() {
  return new Date().toISOString();
}

function isActive(a) {
  if (!a.active) return false;
  const n = Date.now();
  const s = a.startsAt ? new Date(a.startsAt).getTime() : -Infinity;
  const e = a.endsAt ? new Date(a.endsAt).getTime() : Infinity;
  return n >= s && n <= e;
}

/**
 * PUBLIC: list alerts
 * GET /alerts?active=true
 */
router.get("/", (req, res) => {
  const { active } = req.query;
  const alerts = readJSON("data/alerts.json");

  const list = active === "true" ? alerts.filter(isActive) : alerts;
  // sort: critical/high first, then latest
  const rank = (sev) => ({ Critical: 4, High: 3, Medium: 2, Low: 1 }[sev] || 0);

  list.sort((a, b) => {
    const r = rank(b.severity) - rank(a.severity);
    if (r !== 0) return r;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  res.json(list);
});

/**
 * AUTHORITY: create alert
 * POST /alerts
 */
router.post("/", requireAuth, requireRole("AUTHORITY"), (req, res) => {
  const {
    title,
    message = "",
    severity = "Medium",
    department = "general",
    area = "",
    tags = [],
    startsAt = nowISO(),
    endsAt = null,
    active = true
  } = req.body;

  if (!title) return res.status(400).json({ error: "title is required" });
  if (!SEVERITIES.includes(severity)) return res.status(400).json({ error: "invalid severity" });
  if (!DEPTS.includes(department)) return res.status(400).json({ error: "invalid department" });

  const alerts = readJSON("data/alerts.json");
  const newAlert = {
    id: `al${String(alerts.length + 1).padStart(3, "0")}`,
    title,
    message,
    severity,
    department,
    area,
    tags: Array.isArray(tags) ? tags : [],
    startsAt,
    endsAt,
    active: !!active,
    createdBy: req.user.id,
    createdAt: nowISO()
  };

  alerts.unshift(newAlert);
  writeJSON("data/alerts.json", alerts);
  res.status(201).json(newAlert);
});

/**
 * AUTHORITY: update alert
 * PATCH /alerts/:id
 */
router.patch("/:id", requireAuth, requireRole("AUTHORITY"), (req, res) => {
  const { id } = req.params;
  const alerts = readJSON("data/alerts.json");
  const idx = alerts.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ error: "Alert not found" });

  const allowed = ["title", "message", "severity", "department", "area", "tags", "startsAt", "endsAt", "active"];
  for (const k of Object.keys(req.body)) {
    if (!allowed.includes(k)) continue;
    alerts[idx][k] = req.body[k];
  }

  if (alerts[idx].severity && !SEVERITIES.includes(alerts[idx].severity)) {
    return res.status(400).json({ error: "invalid severity" });
  }
  if (alerts[idx].department && !DEPTS.includes(alerts[idx].department)) {
    return res.status(400).json({ error: "invalid department" });
  }

  writeJSON("data/alerts.json", alerts);
  res.json(alerts[idx]);
});

/**
 * AUTHORITY: delete alert
 * DELETE /alerts/:id
 */
router.delete("/:id", requireAuth, requireRole("AUTHORITY"), (req, res) => {
  const { id } = req.params;
  const alerts = readJSON("data/alerts.json");
  const next = alerts.filter(a => a.id !== id);
  if (next.length === alerts.length) return res.status(404).json({ error: "Alert not found" });
  writeJSON("data/alerts.json", next);
  res.json({ ok: true });
});

export default router;