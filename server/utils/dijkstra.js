// server/utils/dijkstra.js
// Returns shortest distance + path + legs (each leg includes mode/route info)

export default function dijkstra(graph, start, end) {
  const dist = {};
  const prevNode = {};
  const prevEdge = {};
  const visited = new Set();

  // init
  for (const node of Object.keys(graph)) {
    dist[node] = Infinity;
    prevNode[node] = null;
    prevEdge[node] = null;
  }
  dist[start] = 0;

  while (true) {
    // pick smallest unvisited
    let cur = null;
    let best = Infinity;

    for (const node of Object.keys(dist)) {
      if (!visited.has(node) && dist[node] < best) {
        best = dist[node];
        cur = node;
      }
    }

    if (cur === null) break;
    if (cur === end) break;

    visited.add(cur);

    // relax edges
    for (const edge of graph[cur] || []) {
      const next = edge.node;
      const cost = Number(edge.cost || 0);
      if (visited.has(next)) continue;

      const nd = dist[cur] + cost;
      if (nd < dist[next]) {
        dist[next] = nd;
        prevNode[next] = cur;

        // store the actual edge used to reach `next`
        prevEdge[next] = {
          from: cur,
          to: next,
          cost,
          mode: edge.mode || "BUS",
          routeNo: edge.routeNo || "",
          routeName: edge.routeName || ""
        };
      }
    }
  }

  // unreachable
  if (dist[end] === Infinity) {
    return { distance: Infinity, path: [], legs: [] };
  }

  // reconstruct path (nodes)
  const path = [];
  let cur = end;
  while (cur) {
    path.unshift(cur);
    cur = prevNode[cur];
  }

  // reconstruct legs (edges used)
  const legs = [];
  for (let i = 1; i < path.length; i++) {
    const node = path[i];
    const leg = prevEdge[node];
    if (leg) legs.push(leg);
  }

  return { distance: dist[end], path, legs };
}