import { useEffect, useMemo, useState } from "react";
import "../../styles/authorityComplaints.css";
import { complaintsAPI } from "../../services/complaints.api";
import { useAuth } from "../../context/AuthContext";

const DEPTS = ["all", "roads", "electricity", "water", "transport", "sanitation"];
const STATUSES = ["All", "Open", "In Progress"];
const SORTS = [
  { label: "Newest", value: "new" },
  { label: "Top voted", value: "top" },
];

export default function AuthorityComplaints() {
  const { user } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dept, setDept] = useState("all");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("top");
  const [q, setQ] = useState("");

  const load = async () => {
  setLoading(true);
  try {
    const data = await complaintsAPI.govList(sort);
    setComplaints(Array.isArray(data) ? data : []);
  } catch (e) {
    console.error("Authority complaints load error", e);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  load();
}, [sort]); 

const notResolved = (c) => (c.status || "").toLowerCase() !== "resolved";

const filtered = useMemo(() => {
  const query = q.trim().toLowerCase();

  return complaints
    .filter(notResolved) 
    .filter((c) => {
      const okDept =
        dept === "all" ? true : (c.department || "").toLowerCase() === dept;

     
      if (status === "Resolved") return false;

      const okStatus = status === "All" ? true : c.status === status;

      const hay = `${c.title || ""} ${c.description || ""} ${c.area || ""} ${c.department || ""}`.toLowerCase();
      const okQ = !query ? true : hay.includes(query);

      return okDept && okStatus && okQ;
    });
}, [complaints, dept, status, q]);
  
  const topUrgent = useMemo(() => {
    return [...complaints]
      .filter(notResolved)
      .sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0))
      .slice(0, 5);
  }, [complaints]);

  const updateStatus = async (id, nextStatus) => {
   
    setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status: nextStatus } : c)));

    try {
      await complaintsAPI.govUpdateStatus(id, nextStatus);
    } catch (e) {
      console.log("Status update failed:", e?.response?.data || e.message);
      
      load();
    }
  };

  return (
    <div className="authority-complaints dash">
      <div className="dash-top">
        <div>
          <div className="dash-city">HUBBALLI CITY</div>
          <div className="dash-title">Complaints Control</div>
          <div className="dash-subtitle">
            Welcome, <b>{user?.name}</b> • Prioritise & update city-wide complaints.
          </div>
        </div>
      </div>

      <div className="ac-grid">
        {/* LEFT: Top urgent */}
        <aside className="ac-left">
          <div className="card">
            <h3>Top 5 Priority (City)</h3>
            <div className="muted">Highest voted issues — act first.</div>

            <div className="ac-list ac-urgent">
              {loading && <div className="ac-row">Loading…</div>}
              {!loading && topUrgent.length === 0 && <div className="ac-row">No complaints yet.</div>}

              {!loading && topUrgent.map((c) => (
                <div className="ac-row urgent" key={c.id}>
                  <div className="ac-row-main">
                    <div className="ac-title">{c.title}</div>
                    <div className="ac-meta">
                      {c.department} • {c.area || "City"} • <span className={`st ${stClass(c.status)}`}>{c.status}</span>
                    </div>
                    {c.description && <div className="ac-desc">{c.description}</div>}
                  </div>

                  <div className="ac-rightbits">
                    <span className="chip votes">votes: {c.votes ?? 0}</span>
                    <select
                      className="select-sm"
                      value={c.status}
                      onChange={(e) => updateStatus(c.id, e.target.value)}
                    >
                      <option>Open</option>
                      <option>In Progress</option>
                      <option>Resolved</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT: All complaints */}
        <section className="ac-right">
          <div className="card">
            <div className="ac-controls">
              <div className="ac-control">
                <label>Search</label>
                <input
                  className="input"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by title, area, department…"
                />
              </div>

              <div className="ac-control">
                <label>Department</label>
                <select className="select" value={dept} onChange={(e) => setDept(e.target.value)}>
                  {DEPTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="ac-control">
                <label>Status</label>
                <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="ac-control">
                <label>Sort</label>
                <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
                  {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>

            <div className="ac-scroll">
              {loading && <div className="ac-row">Loading…</div>}
              {!loading && filtered.length === 0 && <div className="ac-row">No complaints match filters.</div>}

              {!loading && filtered.map((c) => (
                <div className="ac-row" key={c.id}>
                  <div className="ac-row-main">
                    <div className="ac-title">{c.title}</div>
                    <div className="ac-meta">
                      {c.department} • {c.area || "City"} • Created by: {c.createdBy || "citizen"} •{" "}
                      <span className={`st ${stClass(c.status)}`}>{c.status}</span>
                    </div>
                    {c.description && <div className="ac-desc">{c.description}</div>}
                  </div>

                  <div className="ac-rightbits">
                    <span className="chip votes">votes: {c.votes ?? 0}</span>
                    <select
                      className="select-sm"
                      value={c.status}
                      onChange={(e) => updateStatus(c.id, e.target.value)}
                    >
                      <option>Open</option>
                      <option>In Progress</option>
                      <option>Resolved</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function stClass(status) {
  if (status === "Resolved") return "ok";
  if (status === "In Progress") return "mid";
  return "bad";
}