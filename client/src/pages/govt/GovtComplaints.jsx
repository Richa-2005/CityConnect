import { useEffect, useMemo, useState } from "react";
import "../../styles/govtComplaints.css";
import { complaintsAPI } from "../../services/complaints.api";
import { useAuth } from "../../context/AuthContext";

const statusClass = (status = "") => {
  const s = status.toLowerCase();
  if (s === "open") return "open";
  if (s === "in progress") return "progress";
  if (s === "resolved") return "resolved";
  return "neutral";
};

export default function GovtComplaints() {
  const { user } = useAuth();
  const dept = user?.department;

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sort, setSort] = useState("new"); // new | top
  const [statusFilter, setStatusFilter] = useState("all"); // all | Open | In Progress | Resolved
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await complaintsAPI.govList(sort);
      setList(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dept) load();
  }, [dept, sort]);
const notResolved = (c) =>
  String(c.status || "").trim().toLowerCase() !== "resolved";

const filtered = useMemo(() => {
  const query = q.trim().toLowerCase();

  return list
    .filter(notResolved)
    .filter((c) => {
      if (statusFilter === "all") return true;
      return c.status === statusFilter;
    })
    .filter((c) => {
      if (!query) return true;
      const hay = `${c.title} ${c.description} ${c.area} ${c.department}`.toLowerCase();
      return hay.includes(query);
    });
}, [list, statusFilter, q]);

  const updateStatus = async (id, newStatus) => {
    await complaintsAPI.govUpdateStatus(id, newStatus);
    await load();
  };
 const top5 = useMemo(() => {
  return [...list]
    .filter(notResolved) // ✅ REQUIRED
    .sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0))
    .slice(0, 5);
}, [list]);
  return (
    <div className="govt-page">
      <div className="govt-header">
        <div>
          <div className="govt-city">Hubballi City</div>
          <h1>Complaints Management</h1>
          <p>
            Department: <b>{dept}</b> • Update complaint status to keep citizens informed.
          </p>
        </div>

        <button className="btn-sm primary" onClick={load}>Refresh</button>
      </div>

      {/* Filters */}
      <div className="govt-filters">
        <div className="field">
          <label>Sort</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="new">Newest</option>
            <option value="top">Top voted</option>
          </select>
        </div>

        <div className="field">
          <label>Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="field grow">
          <label>Search</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title / area / description…"
          />
        </div>
      </div>

      {/* List */}
      {loading && <div className="govt-card">Loading…</div>}

      <div className="govt-complaints-layout">

  {/* LEFT: Top 5 (sticky) */}
  <aside className="top5">
    <div className="top5-head">
      <h2>Top 5 Priority (Dept)</h2>
      <p>Highest voted issues — act first.</p>
    </div>

    {top5.map((c) => (
      <div className="urgent-card" key={c.id}>
        <div className="urgent-top">
          <div>
            <div className="urgent-title">{c.title}</div>
            <div className="urgent-meta">{c.area || "N/A"} • Votes: {c.votes ?? 0}</div>
          </div>

          <span className={`chip status ${statusClass(c.status)}`}>{c.status}</span>
        </div>

        <div className="urgent-actions">
          <label className="mini-label">Update</label>
          <select
            className="select-sm"
            value={c.status}
            onChange={(e) => updateStatus(c.id, e.target.value)}
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>
    ))}

    {top5.length === 0 && <div className="urgent-card">No complaints yet.</div>}
  </aside>

  {/* RIGHT: Full list */}
  <section className="all-list">
    <div className="all-head">
      <h2>All Department Complaints</h2>
      <p>Search, filter and update status.</p>
    </div>

    <div className="govt-scroll">
      {loading && <div className="govt-card">Loading…</div>}

      {!loading && filtered.map((c) => (
        <div className="govt-card" key={c.id}>
          <div className="govt-top">
            <div>
              <div className="govt-title">{c.title}</div>
              <div className="govt-meta">
                {c.department} • {c.area || "N/A"} • Created by: {c.createdBy}
              </div>

              <div className="chip-row">
                <span className={`chip status ${statusClass(c.status)}`}>{c.status}</span>
                <span className="chip neutral">Votes: {c.votes ?? 0}</span>
              </div>
            </div>

            <div className="govt-actions">
              <label className="mini-label">Update status</label>
              <select
                className="select-sm"
                value={c.status}
                onChange={(e) => updateStatus(c.id, e.target.value)}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          <div className="complaint-body">
            {c.imageUrl && (
              <div className="complaint-image-wrap">
                <img className="complaint-image" src={c.imageUrl} alt="Complaint" />
              </div>
            )}

            <div className="complaint-desc">
              <b>Description</b>
              <p>{c.description || "No description provided."}</p>
            </div>
          </div>
        </div>
      ))}

      {!loading && filtered.length === 0 && (
        <div className="govt-card">No complaints match your filters.</div>
      )}
    </div>
  </section>

</div>
     
    </div>
  );
}