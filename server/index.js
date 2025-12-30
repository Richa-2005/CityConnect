import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import complaintsRoutes from "./routes/complaints.routes.js";
import projectsRoutes from "./routes/projects.routes.js";
import alertsRoutes from "./routes/alerts.routes.js";
import transportRoutes from "./routes/transport.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "x-user-id"]
}));

app.use(express.json());


app.use("/auth", authRoutes);
app.use("/complaints", complaintsRoutes);
app.use("/projects", projectsRoutes);
app.use("/alerts", alertsRoutes);
app.use("/transport", transportRoutes);


app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`CityConnect running on port ${PORT}`);
});