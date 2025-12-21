import express from "express";
import { readJSON } from "../utils/readWriteJSON.js";

const router = express.Router();

router.post("/login", (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "userId is required" });

  const users = readJSON("data/users.json");
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(401).json({ error: "Invalid userId" });

  // Mock token (frontend can store userId and send it as x-user-id)
  res.json({ token: "mock-token", user });
});

export default router;