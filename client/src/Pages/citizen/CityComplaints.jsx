import { useEffect, useMemo, useState } from "react";
import "../../styles/complaints.css";
import { complaintsAPI } from "../../services/complaints.api";
import { useAuth } from "../../context/AuthContext";
const DEPTS = ["roads", "electricity", "water", "sanitation", "transport", "other"];

export default function CityComplaints() {
    const { user } = useAuth();
const myId = user?.id;
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    title: "",
    department: "roads",
    area: "",
    description: "",
    imageUrl: "", // optional (demo)
  });

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const loadTop = async () => {
    setLoading(true);
    try {
      const data = await complaintsAPI.listPublic("top"); // votes desc
      setList(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTop();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!form.title.trim() || !form.department) {
      setErr("Title and department are required.");
      return;
    }

    setSubmitting(true);
    try {
      // Backend accepts: title, description, department, area
      // imageUrl isn't stored by backend yet (ok for now)
      await complaintsAPI.create({
        title: form.title.trim(),
        department: form.department,
        area: form.area.trim(),
        description: form.description.trim(),
        // imageUrl intentionally not sent unless you later add it to backend
      });

      setForm({
        title: "",
        department: "roads",
        area: "",
        description: "",
        imageUrl: "",
      });

      setShowForm(false);
      await loadTop();
    } catch (error) {
      setErr(error?.response?.data?.error || "Failed to submit complaint.");
    } finally {
      setSubmitting(false);
    }
  };

  // Optional: local filter UI (quick judge-friendly)
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return list;
    return list.filter((c) =>
      `${c.title} ${c.description} ${c.department} ${c.area}`
        .toLowerCase()
        .includes(query)
    );
  }, [list, q]);

  const statusClass = (status = "") => {
  const s = status.toLowerCase();
  if (s === "open") return "open";
  if (s === "in progress") return "progress";
  if (s === "resolved") return "resolved";
  return "neutral";
};

  return (
    <div className="complaints-page">
      <div className="complaints-header">
        <div>
          <h1>Complaints</h1>
          <p>
            Raise issues and vote to prioritize urgent problems. Sorted by highest votes.
          </p>
        </div>

        <div className="complaints-header-actions">
          <input
            className="search"
            placeholder="Search complaints…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="btn-sm primary" onClick={loadTop}>
            Refresh
          </button>
        </div>
      </div>

      {/* Raise Complaint (collapsible) */}
      <div className="raise-card">
        <div className="raise-top" onClick={() => setShowForm((s) => !s)}>
          <div>
            <div className="raise-title">Raise a Complaint</div>
            <div className="raise-sub">
              Provide details so the correct department can take action.
            </div>
          </div>

          <button className="btn-sm" type="button">
            {showForm ? "Hide" : "Show"}
          </button>
        </div>

        {showForm && (
          <form className="raise-form" onSubmit={handleSubmit}>
            {err && <div className="form-error">{err}</div>}

            <div className="form-grid">
              <div className="field span-12">
                <label>Title *</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  placeholder="e.g., Open drain near KIMS"
                  required
                />
              </div>

              <div className="field span-6">
                <label>Department *</label>
                <select name="department" value={form.department} onChange={onChange}>
                  {DEPTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field span-6">
                <label>Area</label>
                <input
                  name="area"
                  value={form.area}
                  onChange={onChange}
                  placeholder="e.g., Hosur / CBT"
                />
              </div>

              <div className="field span-12">
                <label>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  placeholder="Explain the issue clearly (what, where, urgency)."
                  rows={4}
                />
              </div>

              <div className="field span-12">
                <label>Image URL (optional for demo)</label>
                <input
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={onChange}
                  placeholder="Paste a public image URL (we'll enable upload later)"
                />
                <div className="helper">
                  Note: Upload will be enabled later. For demo, you can paste an image link.
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-sm primary" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Complaint"}
              </button>
              <button
                className="btn-sm"
                type="button"
                onClick={() =>
                  setForm({
                    title: "",
                    department: "roads",
                    area: "",
                    description: "",
                    imageUrl: "",
                  })
                }
              >
                Clear
              </button>
            </div>
          </form>
        )}
      </div>
      
        <div className="complaints-section">
        <h2>City Complaints</h2>
        <p>
            All reported issues across the city, sorted by highest votes.
            Vote to highlight urgent problems.
        </p>
        </div>

      {/* List */}
      {loading && <div className="complaint-card">Loading…</div>}

      {!loading &&
        filtered.map((c) => (
          <div className="complaint-card" key={c.id}>
            <div className="complaint-top">
              <div className="left">
                <div className="complaint-title">{c.title}</div>
                <div className="complaint-meta">
  {c.department} • {c.area || "N/A"}
</div>

<div className="chip-row">
  {c.createdBy === myId && <span className="chip my">My Complaint</span>}
  <span className={`chip status ${statusClass(c.status)}`}>{c.status}</span>
</div>
              </div>

              <div className="complaint-actions">
                <span className="badge">votes: {c.votes ?? 0}</span>
                <button
                  className="btn-sm primary"
                  onClick={async () => {
                    await complaintsAPI.vote(c.id);
                    await loadTop();
                  }}
                >
                  Vote
                </button>
              </div>
            </div>

            {/* Show image if present in data (or if you later store it) */}
            {c.imageUrl && (
              <img className="complaint-image" src={c.imageUrl} alt="Complaint" />
            )}

            <div className="complaint-desc">
              {c.description || "No description provided."}
            </div>
          </div>
        ))}

      {!loading && filtered.length === 0 && (
        <div className="complaint-card">No complaints found.</div>
      )}
    </div>
  );
}