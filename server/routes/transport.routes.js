import express from "express";
import { readJSON } from "../utils/readWriteJSON.js";
import dijkstra from "../utils/dijkstra.js"; 

const router = express.Router();

/**
 * PUBLIC: list stops
 * GET /transport/stops?q=cbt
 */
router.get("/stops", (req, res) => {
  const { q } = req.query;
  let stops = readJSON("data/transportStops.json");
  if (q) {
    const s = q.toLowerCase();
    stops = stops.filter(x =>
      x.name.toLowerCase().includes(s) || (x.area || "").toLowerCase().includes(s)
    );
  }
  res.json(stops);
});

/**
 * PUBLIC: list routes (edges)
 * GET /transport/routes
 */
router.get("/routes", (req, res) => {
  const routes = readJSON("data/transportRoutes.json");
  res.json(routes);
});

/**
 * PUBLIC: find shortest path
 * GET /transport/path?from=st001&to=st003
 */
router.get("/path", (req, res) => {
  const { from, to } = req.query;
  if (!from || !to) return res.status(400).json({ error: "from and to are required" });

  const stops = readJSON("data/transportStops.json");
  const edges = readJSON("data/transportRoutes.json");

  const stopMap = Object.fromEntries(stops.map(s => [s.id, s]));
  if (!stopMap[from] || !stopMap[to]) return res.status(404).json({ error: "Invalid stop id" });

  // Build adjacency list WITH route details
  const graph = {};
  for (const e of edges) {
    if (!graph[e.from]) graph[e.from] = [];
    if (!graph[e.to]) graph[e.to] = [];

    graph[e.from].push({
      node: e.to,
      cost: e.cost,
      mode: e.mode || "BUS",
      routeNo: e.routeNo || "",
      routeName: e.routeName || ""
    });

    graph[e.to].push({
      node: e.from,
      cost: e.cost,
      mode: e.mode || "BUS",
      routeNo: e.routeNo || "",
      routeName: e.routeName || ""
    }); // undirected
  }

  const result = dijkstra(graph, from, to);

  if (!result || !result.path || result.path.length === 0) {
    return res.status(404).json({ error: "No path found" });
  }

  const pathStops = result.path.map(id => stopMap[id]);

  // Build journey legs (with stop names)
  const journey = (result.legs || []).map((leg) => ({
    from: stopMap[leg.from],
    to: stopMap[leg.to],
    mode: leg.mode,
    routeNo: leg.routeNo,
    routeName: leg.routeName,
    cost: leg.cost
  }));

  // Build instructions + transfers count (judge-friendly)
  const instructions = [];
  let transfers = 0;

  for (let i = 0; i < journey.length; i++) {
    const j = journey[i];
    const label = `${j.mode}${j.routeNo ? " " + j.routeNo : ""}${j.routeName ? " (" + j.routeName + ")" : ""}`;

    if (i === 0) {
      instructions.push(
        `Board ${label} at ${j.from.name} → get down at ${j.to.name}.`
      );
    } else {
      const prev = journey[i - 1];
      const prevLabel = `${prev.mode}${prev.routeNo ? " " + prev.routeNo : ""}`;
      const curLabel = `${j.mode}${j.routeNo ? " " + j.routeNo : ""}`;

      if (prevLabel !== curLabel) {
        transfers += 1;
        instructions.push(
          `Transfer at ${j.from.name} and take ${label} → get down at ${j.to.name}.`
        );
      } else {
        instructions.push(
          `Continue on ${label} → get down at ${j.to.name}.`
        );
      }
    }
  }

  res.json({
    from: stopMap[from],
    to: stopMap[to],
    totalCost: result.distance,
    transfers,
    path: pathStops,
    journey,
    instructions
  });
});

export default router;