import { useEffect, useMemo, useState } from "react";
import "../../styles/govtAnalytics.css";
import { complaintsAPI } from "../../services/complaints.api";
import { projectsAPI } from "../../services/projects.api";
import { useAuth } from "../../context/AuthContext";

export default function GovtAnalytics() {
  const { user } = useAuth();
  const dept = user?.department;

  const [complaints, setComplaints] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dept) return;
    const load = async () => {
      setLoading(true);
      try {
        const c = await complaintsAPI.govList("new");
        const p = await projectsAPI.list({ department: dept });
        setComplaints(c);
        setProjects(p);
      } finally {
        setLoading(false);
      }
    }
    load();
},[])
        /* ---------- Complaint stats ---------- */
  const complaintStats = useMemo(() => {
    const total = complaints.length;
    const open = complaints.filter(c => c.status === "Open").length;
    const inProg = complaints.filter(c => c.status === "In Progress").length;
    const resolved = complaints.filter(c => c.status === "Resolved").length;

    return { total, open, inProg, resolved };
  }, [complaints]);

  /* ---------- Area distribution ---------- */
  const areaStats = useMemo(() => {
    const map = {};
    complaints.forEach(c => {
      if (!c.area) return;
      map[c.area] = (map[c.area] || 0) + 1;
    });

    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [complaints]);

  /* ---------- Complaint trend (last 7 entries) ---------- */
  const trendStats = useMemo(() => {
    const map = {};
    complaints.forEach(c => {
      const d = new Date(c.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short"
      });
      map[d] = (map[d] || 0) + 1;
    });

    return Object.entries(map).slice(-7);
  }, [complaints]);


  
  /* ---------- Project stats ---------- */
  const projectStats = useMemo(() => {
    return {
      total: projects.length,
      planned: projects.filter(p => p.status === "Planned").length,
      ongoing: projects.filter(p => p.status === "Ongoing").length,
      completed: projects.filter(p => p.status === "Completed").length
    };
  }, [projects]);

  return (
    <div className="analytics">
      <div className="analytics-header">
        <div>
          <div className="city">Hubballi City</div>
          <h1>Department Analytics</h1>
          <p>
            Department: <b>{dept}</b> • Data-driven insights for prioritisation
          </p>
        </div>
      </div>

      {loading && <div className="card">Loading analytics…</div>}

      {!loading && (
        <div className="grid">
          {/* KPI cards */}
          <div className="card span-3">
            <h3>Total Complaints</h3>
            <div className="big">{complaintStats.total}</div>
          </div>

          <div className="card span-3">
            <h3>Open</h3>
            <div className="big orange">{complaintStats.open}</div>
          </div>

          <div className="card span-3">
            <h3>In Progress</h3>
            <div className="big blue">{complaintStats.inProg}</div>
          </div>

          <div className="card span-3">
            <h3>Resolved</h3>
            <div className="big green">{complaintStats.resolved}</div>
          </div>

          {/* Area impact */}
          <div className="card span-6">
            <h3>Top Affected Areas</h3>
            {areaStats.length === 0 && <p className="muted">No data yet.</p>}
            {areaStats.map(([area, count]) => (
              <div className="bar-row" key={area}>
                <span>{area}</span>
                <div className="bar">
                  <div style={{ width: `${count * 15}%` }} />
                </div>
                <b>{count}</b>
              </div>
            ))}
          </div>

          {/* Trend */}
          
          <div className="card span-6">
            <h3>Complaint Trend</h3>
           <div className="miniChart">
  {trendStats.map(([day, count]) => {
    const max = Math.max(...trendStats.map(([, c]) => c), 1);
    const h = Math.round((count / max) * 100);

    return (
      <div className="miniCol" key={day} title={`${day}: ${count}`}>
        <div className="barWrap">
          <div className="miniBar" style={{ height: `${h}%` }} />
        </div>
        <div className="miniLabel">{day}</div>
        <div className="miniValue">{count}</div>
      </div>
    );
  })}
</div>
            
          </div>

          {/* Projects snapshot */}
          <div className="card span-12">
            <h3>Projects Snapshot</h3>
            <div className="pill-row">
              <span className="pill neutral">Total: {projectStats.total}</span>
              <span className="pill orange">Planned: {projectStats.planned}</span>
              <span className="pill blue">Ongoing: {projectStats.ongoing}</span>
              <span className="pill green">Completed: {projectStats.completed}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}