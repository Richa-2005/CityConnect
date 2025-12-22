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
  const totalP = projects.length;
const plannedP = projects.filter(p => p.status === "Planned").length;
const ongoingP = projects.filter(p => p.status === "Ongoing").length;
const completedP = projects.filter(p => p.status === "Completed").length;
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
  const fmt = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

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
    <div className="dash-city">Hubballi City</div>
    <div className="dash-title">Govt Dashboard</div>

    <div className="dash-subtitle">
      Manage your department’s complaints and projects.
    </div>

    <div className="dash-username">
      Logged in as <b>{user?.name}</b> • Dept: <b>{user?.department}</b> • Zone: <b>{user?.zone}</b>
    </div>
  </div>
  <span className="badge blue">{user?.id}</span>
</div>
<div className="card span-12" style={{ marginBottom: "1rem" }}>
  <h3>Officer Guide</h3>

  <div className="guide">
    <div className="guide-item">
      <div className="guide-step">1</div>
      <div>
        <div className="guide-title">Review priority complaints</div>
        <div className="guide-text">Go to <b>Complaints</b> tab → sort by <b>Top voted</b> to see urgent issues first.</div>
      </div>
    </div>

    <div className="guide-item">
      <div className="guide-step">2</div>
      <div>
        <div className="guide-title">Update status</div>
        <div className="guide-text">Move complaints from <b>Open → In Progress → Resolved</b> to keep citizens updated.</div>
      </div>
    </div>

    <div className="guide-item">
      <div className="guide-step">3</div>
      <div>
        <div className="guide-title">Publish project updates</div>
        <div className="guide-text">Use <b>Projects</b> tab to create or update department works with dates and evidence photos.</div>
      </div>
    </div>

    <div className="guide-item">
      <div className="guide-step">4</div>
      <div>
        <div className="guide-title">Use analytics</div>
        <div className="guide-text">Check <b>Analytics</b> for complaint trends and workload insights (helps planning).</div>
      </div>
    </div>
  </div>
</div>

      <div className="grid">
        <div className="card span-6">
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
        <div className="card span-6">
          <h3>Dept Projects</h3>
          <div className="stat-big">{totalP}</div>
          <div className="pill-row">
            <span className="pill neutral">Planned: {plannedP}</span>
            <span className="pill blue">Ongoing: {ongoingP}</span>
            <span className="pill green">Completed: {completedP}</span>
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
                <span className="badge">{fmt(p.startDate)} – {fmt(p.endDate)}</span>
              </div>
            ))}
            {!loading && projects.length === 0 && <div className="row">No projects yet for {dept}.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}