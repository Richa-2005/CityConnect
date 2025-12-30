import { useEffect, useMemo, useState } from "react";
import "../../styles/authority.css";
import { complaintsAPI } from "../../services/complaints.api";
import { projectsAPI } from "../../services/projects.api";
import { useAuth } from "../../context/AuthContext";

const DEPTS = ["roads", "electricity", "water", "transport"];

export default function AuthorityDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
  const key = "cc_help_seen_authority";
  const seen = localStorage.getItem(key);
  if (!seen) {
    setShowHelp(true);
    localStorage.setItem(key, "1");
  }
}, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const c = await complaintsAPI.listPublic("top");
        const p = await projectsAPI.list({});
        setComplaints(Array.isArray(c) ? c : []);
        setProjects(Array.isArray(p) ? p : []);
      } catch (e) {
  console.log("Authority load error:", e?.response?.data || e.message);
} finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const kpis = useMemo(() => {
    const totalC = complaints.length;
    const open = complaints.filter(x => x.status === "Open").length;
    const inProg = complaints.filter(x => x.status === "In Progress").length;
    const resolved = complaints.filter(x => x.status === "Resolved").length;

    const totalP = projects.length;
    const planned = projects.filter(x => x.status === "Planned").length;
    const ongoing = projects.filter(x => x.status === "Ongoing").length;
    const completed = projects.filter(x => x.status === "Completed").length;

    return { totalC, open, inProg, resolved, totalP, planned, ongoing, completed };
  }, [complaints, projects]);

  const byDept = useMemo(() => {
    const map = {};
    for (const d of DEPTS) {
      map[d] = {
        complaints: complaints.filter(c => c.department === d),
        projects: projects.filter(p => p.department === d)
      };
    }
    return map;
  }, [complaints, projects]);

  const topUrgent = useMemo(() => {
    return [...complaints]
      .sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0))
      .slice(0, 5);
  }, [complaints]);

  return (
    <div className="authority-dash dash">
  
      <div className="dash-top">
  <div>
    <div className="dash-city">HUBBALLI CITY</div>
    <div className="dash-title">Authority Dashboard</div>
    <div className="dash-subtitle">
      Welcome, <b>{user?.name}</b> • City-wide overview & governance controls.
    </div>
  </div>

  <div className="dash-actions">
    <button className="help-cta" onClick={() => setShowHelp(true)}>
      🚀 How to use this demo
    </button>
    <span className="pill blue">DEMO • AUTHORITY</span>
  </div>
</div>
{showHelp && (
  <div className="modal-backdrop" onClick={() => setShowHelp(false)}>
    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
      <div className="modal-head">
        <h3>👋 CityConnect — Authority Quick Guide</h3>
        <button className="modal-close" onClick={() => setShowHelp(false)}>
          ✕
        </button>
      </div>

      <p className="modal-sub">
        This demo takes less than <b>1 minute</b>. Here’s what to explore:
      </p>

      <div className="guide-big">
        <div className="guide-item-big">
          <div className="guide-step-big">1</div>
          <div>
            <div className="guide-title-big">Monitor city-wide complaints</div>
            <div className="guide-text-big">
              View <b>Top Urgent</b> issues by votes and status.
            </div>
          </div>
        </div>

        <div className="guide-item-big">
          <div className="guide-step-big">2</div>
          <div>
            <div className="guide-title-big">Track projects by department</div>
            <div className="guide-text-big">
              Check department snapshot for <b>ongoing work</b> and gaps.
            </div>
          </div>
        </div>

        <div className="guide-item-big">
          <div className="guide-step-big">3</div>
          <div>
            <div className="guide-title-big">Issue alerts (Authority-only)</div>
            <div className="guide-text-big">
              Use the <b>Alerts</b> tab to publish verified, city-wide updates.
            </div>
          </div>
        </div>

        <div className="guide-item-big">
          <div className="guide-step-big">4</div>
          <div>
            <div className="guide-title-big">Govern with prioritization</div>
            <div className="guide-text-big">
              Votes + status help identify what needs action first.
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
      <div className="grid12">
        <div className="span3 kpi-stack">
  <div className="card">
    <h3>Total Complaints</h3>
    <div className="big">{loading ? "—" : kpis.totalC}</div>
    <div className="pill-row">
      <span className="pill orange">Open: {kpis.open}</span>
      <span className="pill blue">In Prog: {kpis.inProg}</span>
      <span className="pill green">Resolved: {kpis.resolved}</span>
    </div>
  </div>

  <div className="card">
    <h3>Total Projects</h3>
    <div className="big">{loading ? "—" : kpis.totalP}</div>
    <div className="pill-row">
      <span className="pill neutral">Planned: {kpis.planned}</span>
      <span className="pill blue">Ongoing: {kpis.ongoing}</span>
      <span className="pill green">Completed: {kpis.completed}</span>
    </div>
  </div>
</div>

<div className="card span6">
   <h3>Top Urgent Complaints (City)</h3>
          <div className="list">
            {loading && <div className="row">Loading…</div>}
            {!loading &&
              topUrgent.map(c => (
                <div className="row" key={c.id}>
                  <div>
                    <div className="row-title">{c.title}</div>
                    <div className="row-meta">
                      {c.department} • {c.area || "City"} • {c.status}
                    </div>
                    {c.description && <div className="row-desc">{c.description}</div>}
                  </div>
                  <span className="pill danger">votes: {c.votes ?? 0}</span>
                </div>
              ))}
          </div>
</div>
        
        </div>

        <div className="card span12">
          <h3>Department Snapshot</h3>
          <div className="deptGrid">
            {DEPTS.map(d => (
              <div className="deptCard" key={d}>
                <div className="deptName">{d.toUpperCase()}</div>
                <div className="deptStats">
                  <div>
                    <div className="miniLabel">Complaints</div>
                    <div className="miniValue">{byDept[d].complaints.length}</div>
                  </div>
                  <div>
                    <div className="miniLabel">Projects</div>
                    <div className="miniValue">{byDept[d].projects.length}</div>
                  </div>
                </div>
                <div className="deptBadges">
                  <span className="pill orange">
                    Open: {byDept[d].complaints.filter(x => x.status === "Open").length}
                  </span>
                  <span className="pill blue">
                    Ongoing: {byDept[d].projects.filter(x => x.status === "Ongoing").length}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
    
    </div>
  );
}