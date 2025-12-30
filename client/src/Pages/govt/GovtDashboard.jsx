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
  const [showHelp, setShowHelp] = useState(false);

  const totalP = projects.length;
  const plannedP = projects.filter(p => p.status === "Planned").length;
  const ongoingP = projects.filter(p => p.status === "Ongoing").length;
  const completedP = projects.filter(p => p.status === "Completed").length;

  useEffect(() => {
    if (!dept) return;
    const key = `cc_help_seen_gov_${dept}`;
    const seen = localStorage.getItem(key);
    if (!seen) {
      setShowHelp(true);
      localStorage.setItem(key, "1");
    }
  }, [dept]);
  


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
  const fmt = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
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
    <div className="dash-city">Hubballi City</div>
    <div className="dash-title">Govt Dashboard</div>

    <div className="dash-subtitle">
      Manage your department’s complaints and projects.
    </div>

    <div className="dash-username">
      Logged in as <b>{user?.name}</b> • Dept: <b>{user?.department}</b> • Zone: <b>{user?.zone}</b>
    </div>
  </div>
  <div className="dash-actions">
  <button className="help-cta" onClick={() => setShowHelp(true)}>
    🚀 How to use this demo
  </button>
  <span className="badge blue">DEMO • {user?.id}</span>
</div>
</div>
{showHelp && (
  <div className="modal-backdrop" onClick={() => setShowHelp(false)}>
    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
      <div className="modal-head">
        <h3>👋 CityConnect — Officer Quick Guide</h3>
        <button className="modal-close" onClick={() => setShowHelp(false)}>
          ✕
        </button>
      </div>

      <p className="modal-sub">
        You are logged in for <b>{dept?.toUpperCase()}</b>. Here’s the fastest way to explore:
      </p>

      <div className="guide-big">
        <div className="guide-item-big">
          <div className="guide-step-big">1</div>
          <div>
            <div className="guide-title-big">Review priority complaints</div>
            <div className="guide-text-big">
              Open <b>Complaints</b> → sort by <b>Top voted</b> to catch urgent issues first.
            </div>
          </div>
        </div>

        <div className="guide-item-big">
          <div className="guide-step-big">2</div>
          <div>
            <div className="guide-title-big">Update status quickly</div>
            <div className="guide-text-big">
              Move issues from <b>Open → In Progress → Resolved</b> to keep citizens informed.
            </div>
          </div>
        </div>

        <div className="guide-item-big">
          <div className="guide-step-big">3</div>
          <div>
            <div className="guide-title-big">Publish project updates</div>
            <div className="guide-text-big">
              Add department projects with dates, location and proof for transparency.
            </div>
          </div>
        </div>

        <div className="guide-item-big">
          <div className="guide-step-big">4</div>
          <div>
            <div className="guide-title-big">Use analytics</div>
            <div className="guide-text-big">
              Spot workload trends and plan resources for your zone.
            </div>
          </div>
        </div>
      </div>

      <div className="modal-foot">
        <button className="btn-sm primary" onClick={() => setShowHelp(false)}>
          Got it — continue
        </button>
      </div>
    </div>
  </div>
)}

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
          <div className="stat-big">{loading ? "—" : totalP}</div>
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