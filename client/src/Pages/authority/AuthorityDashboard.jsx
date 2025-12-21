import { useEffect, useMemo, useState } from "react";
import "../../styles/dashboard.css";
import { complaintsAPI } from "../../services/complaints.api";
import { projectsAPI } from "../../services/projects.api";

export default function AuthorityDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [c, p] = await Promise.all([
          complaintsAPI.listPublic("new"),
          projectsAPI.list({ sort: "new" }),
        ]);
        setComplaints(c);
        setProjects(p);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = useMemo(() => ({
    complaintsTotal: complaints.length,
    complaintsOpen: complaints.filter(c => c.status === "Open").length,
    projectsTotal: projects.length,
    projectsOngoing: projects.filter(p => p.status === "Ongoing").length,
  }), [complaints, projects]);

  return (
    <div className="dash">
      <div className="dash-top">
        <div>
          <div className="dash-title">Authority Overview</div>
          <div className="dash-subtitle">City-level visibility across departments.</div>
        </div>
        <span className="badge">citywide</span>
      </div>

      <div className="grid">
        <div className="card span-4">
          <h3>Complaints</h3>
          <div className="stat">
            <div className="value">{loading ? "—" : stats.complaintsTotal}</div>
            <span className="badge">total</span>
          </div>
          <div style={{ marginTop: "0.75rem" }}>
            <span className="badge orange">Open: {loading ? "—" : stats.complaintsOpen}</span>
          </div>
        </div>

        <div className="card span-4">
          <h3>Projects</h3>
          <div className="stat">
            <div className="value">{loading ? "—" : stats.projectsTotal}</div>
            <span className="badge">total</span>
          </div>
          <div style={{ marginTop: "0.75rem" }}>
            <span className="badge blue">Ongoing: {loading ? "—" : stats.projectsOngoing}</span>
          </div>
        </div>

        <div className="card span-12">
          <h3>Latest Complaints</h3>
          <div className="list">
            {loading && <div className="row">Loading…</div>}
            {!loading && complaints.slice(0, 6).map((c) => (
              <div className="row" key={c.id}>
                <div>
                  <div className="row-title">{c.title}</div>
                  <div className="row-meta">{c.department} • {c.area} • {c.status}</div>
                </div>
                <span className="badge">votes: {c.votes ?? 0}</span>
              </div>
            ))}
            {!loading && complaints.length === 0 && <div className="row">No complaints yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}