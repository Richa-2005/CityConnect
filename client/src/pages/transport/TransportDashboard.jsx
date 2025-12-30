import "../../styles/dashboard.css";

export default function TransportDashboard() {
  return (
    <div className="dash">
      <div className="dash-header">
        <h1>Transport Dashboard</h1>
        <p>Routes, stops, and smart path suggestions.</p>
      </div>

      <div className="grid">
        <div className="card"><div className="card-title">Route Finder</div><div className="muted">Shortest path (Dijkstra) UI next</div></div>
        <div className="card"><div className="card-title">Stops</div><div className="muted">Browse stops & connectivity</div></div>
      </div>
    </div>
  );
}