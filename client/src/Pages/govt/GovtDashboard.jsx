import { useEffect, useMemo, useState } from "react";
import "../../styles/dashboard.css";
import { useAuth } from "../../context/AuthContext";
import { complaintsAPI } from "../../services/complaints.api";
import { projectsAPI } from "../../services/projects.api";

export default function GovtDashboard() {
  const { user } = useAuth();
  const dept = user?.department;

  const [complaints, setComplaints] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [c, p] = await Promise.all([
        complaintsAPI.govList("new"),
        projectsAPI.list({ department: dept, sort: "new" }),
      ]);
      setComplaints(c);
      setProjects(p.slice(0, 6));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (dept) load(); }, [dept]);

  const stats = useMemo(() => ({
    total: complaints.length,
    open: complaints.filter(c => c.status === "Open").length,
    inProg: complaints.filter(c => c.status === "In Progress").length,
    resolved: complaints.filter(c => c.status === "Resolved").length,
  }), [complaints]);

  return (
    <div className="dash">
      <div className="dash-top">
        <div>
          <div className="dash-title">Govt Dashboard</div>
          <div className="dash-subtitle">Officer: {user?.name} • Dept: <b>{dept}</b> • {user?.zone}</div>
        </div>
        <span className="badge blue">{user?.id}</span>
      </div>

      <div className="grid">
        <div className="card span-4">
          <h3>Dept Complaints</h3>
          <div className="stat">
            <div className="value">{loading ? "—" : stats.total}</div>
            <span className="badge">total</span>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
            <span className="badge orange">Open: {loading ? "—" : stats.open}</span>
            <span className="badge blue">In Progress: {loading ? "—" : stats.inProg}</span>
            <span className="badge green">Resolved: {loading ? "—" : stats.resolved}</span>
          </div>
        </div>

        <div className="card span-8">
          <h3>Latest Complaints (Dept)</h3>
          <div className="list">
            {loading && <div className="row">Loading…</div>}
            {!loading && complaints.slice(0, 6).map((c) => (
              <div className="row" key={c.id}>
                <div>
                  <div className="row-title">{c.title}</div>
                  <div className="row-meta">{c.area || "N/A"} • votes: {c.votes ?? 0}</div>
                </div>

                <div className="actions">
                  <select
                    className="select-sm"
                    value={c.status}
                    onChange={async (e) => {
                      await complaintsAPI.govUpdateStatus(c.id, e.target.value);
                      await load();
                    }}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
            ))}
            {!loading && complaints.length === 0 && <div className="row">No complaints in your department.</div>}
          </div>
        </div>

        <div className="card span-12">
          <h3>Department Projects</h3>
          <div className="list">
            {loading && <div className="row">Loading…</div>}
            {!loading && projects.map((p) => (
              <div className="row" key={p.id}>
                <div>
                  <div className="row-title">{p.title}</div>
                  <div className="row-meta">{p.area || "N/A"} • {p.status}</div>
                </div>
                <span className="badge">{p.startDate} → {p.endDate}</span>
              </div>
            ))}
            {!loading && projects.length === 0 && <div className="row">No projects yet for {dept}.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}