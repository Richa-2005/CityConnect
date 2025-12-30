import { useEffect, useMemo, useState } from "react";
import "../../styles/authorityProjects.css";
import { projectsAPI } from "../../services/projects.api";
import { useAuth } from "../../context/AuthContext";

export default function AuthorityProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const p = await projectsAPI.list({});
      setProjects(Array.isArray(p) ? p : []);
      setLoading(false);
    };
    load();
  }, []);

  const today = new Date();

  const stats = useMemo(() => {
    const total = projects.length;
    const ongoing = projects.filter(p => p.status === "Ongoing").length;
    const completed = projects.filter(p => p.status === "Completed").length;
    const delayed = projects.filter(
      p => p.status !== "Completed" && new Date(p.endDate) < today
    ).length;

    return { total, ongoing, completed, delayed };
  }, [projects]);

  return (
    <div className="authority-projects dash">
      <div className="dash-top">
        <div>
          <div className="dash-city">HUBBALLI CITY</div>
          <div className="dash-title">City Projects</div>
          <div className="dash-subtitle">
            Welcome, <b>{user?.name}</b> • Monitor and oversee all city projects.
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid12">
        <div className="card span3">
          <h3>Total Projects</h3>
          <div className="big">{stats.total}</div>
        </div>
        <div className="card span3">
          <h3>Ongoing</h3>
          <div className="big">{stats.ongoing}</div>
        </div>
        <div className="card span3">
          <h3>Delayed</h3>
          <div className="big danger">{stats.delayed}</div>
        </div>
        <div className="card span3">
          <h3>Completed</h3>
          <div className="big green">{stats.completed}</div>
        </div>
      </div>

      {/* Projects List */}
      <div className="card span12" style={{ marginTop: "1rem" }}>
        <h3>All City Projects</h3>

        {loading && <div className="row">Loading…</div>}

        {!loading &&
          projects.map(p => {
            const isDelayed =
              p.status !== "Completed" && new Date(p.endDate) < today;

            return (
              <div className={`row project-row ${isDelayed ? "delayed" : ""}`} key={p.id}>
                <div>
                  <div className="row-title">{p.title}</div>
                  <div className="row-meta">
                    {p.department} • {p.area || "City"}
                  </div>
                  <div className="row-desc">
                    {p.startDate} → {p.endDate}
                  </div>
                </div>

                <div className="project-right">
                  {isDelayed && <span className="pill danger">Delayed</span>}
                  <span className={`pill status ${p.status.toLowerCase()}`}>
                    {p.status}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}