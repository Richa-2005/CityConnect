export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(500).json({ error: "Auth middleware not applied" });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: insufficient role" });
    }
    next();
  };
}