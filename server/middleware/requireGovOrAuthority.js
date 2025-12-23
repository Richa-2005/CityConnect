export function requireGovOrAuthority(req, res, next) {
  const role = String(req.user?.role || "").toUpperCase();

  if (role !== "GOVT" && role !== "AUTHORITY") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}