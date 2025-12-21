import { useEffect, useMemo, useState } from "react";
import "../../styles/projects.css";
import { projectsAPI } from "../../services/projects.api";

const DEPTS = ["all", "roads", "electricity", "water", "sanitation", "transport", "general"];
const STATUSES = ["all", "Planned", "Ongoing", "Completed"];

const statusClass = (status = "") => {
  const s = status.toLowerCase();
  if (s === "planned") return "open";
  if (s === "ongoing") return "progress";
  if (s === "completed") return "resolved";
  return "neutral";
};

export default function CitizenProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dept, setDept] = useState("all");
  const [status, setStatus] = useState("all");
  const [area, setArea] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await projectsAPI.list({ sort: "new" });
      setProjects(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (dept !== "all" && p.department !== dept) return false;
      if (status !== "all" && p.status !== status) return false;
      if (area.trim() && !(p.area || "").toLowerCase().includes(area.trim().toLowerCase())) return false;
      return true;
    });
  }, [projects, dept, status, area]);

  return (
    <div className="projects-page">
      <div className="projects-header">
        <div>
          <h1>Projects</h1>
          <p>Track ongoing and upcoming civic works across the city.</p>
        </div>

        <button className="btn-sm primary" onClick={load}>Refresh</button>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="field">
          <label>Department</label>
          <select value={dept} onChange={(e) => setDept(e.target.value)}>
            {DEPTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="field">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="field grow">
          <label>Area</label>
          <input
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Search by area (e.g., CBT, Hosur)"
          />
        </div>
      </div>

      {/* List */}
      {loading && <div className="project-card">Loading…</div>}

      {!loading && filtered.map((p) => (
        <div className="project-card" key={p.id}>
          <div className="project-top">
            <div>
              <div className="project-title">{p.title}</div>
              <div className="project-meta">
                {p.department} • {p.area || "N/A"}
              </div>

              <div className="chip-row">
                <span className={`chip status ${statusClass(p.status)}`}>{p.status}</span>
              </div>
            </div>

            <div className="project-right">
              <div className="date-pill">{p.startDate} → {p.endDate}</div>
            </div>
          </div>

          <div className="project-desc">
            {p.description || "No description available."}
          </div>
        </div>
      ))}

      {!loading && filtered.length === 0 && (
        <div className="project-card">No projects match your filters.</div>
      )}
    </div>
  );
}