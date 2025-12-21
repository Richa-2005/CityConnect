import { readJSON } from "../utils/readWriteJSON.js";

export function requireAuth(req, res, next) {
  const userId = req.header("x-user-id");
  if (!userId) return res.status(401).json({ error: "Missing x-user-id header" });

  const users = readJSON("data/users.json");
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(401).json({ error: "Invalid user" });

  req.user = user;
  next();
}
