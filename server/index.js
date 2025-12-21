import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import complaintsRoutes from "./routes/complaints.routes.js";
import projectsRoutes from "./routes/projects.routes.js";
//import alertsRoutes from "./routes/alerts.routes.js";
//import transportRoutes from "./routes/transport.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "CityConnect API is running"
  });
});

app.use("/auth", authRoutes);
app.use("/complaints", complaintsRoutes);
app.use("/projects", projectsRoutes);
//app.use("/alerts", alertsRoutes);
//app.use("/transport", transportRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));