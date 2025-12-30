import { useEffect, useMemo, useState } from "react";
import "../../styles/govtProjects.css";
import { projectsAPI } from "../../services/projects.api";
import { useAuth } from "../../context/AuthContext";

const allowedStatus = ["Planned", "Ongoing", "Completed"];

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export default function GovtProjects() {
  const { user } = useAuth();
  const dept = user?.department;

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [sort, setSort] = useState("new"); // new | old
  const [statusFilter, setStatusFilter] = useState("all");
  const [area, setArea] = useState("");
  const [q, setQ] = useState("");

  // Create form
  const [form, setForm] = useState({
    title: "",
    area: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Planned",
    imageUrl: ""
  });
  const [updateBox, setUpdateBox] = useState({ open: false, id: null, note: "", imageUrl: "" });

const postUpdate = async () => {
  if (!updateBox.note.trim()) return;

  await updateProject(updateBox.id, {
    progressNote: updateBox.note.trim(),
    progressImageUrl: updateBox.imageUrl.trim()
  });

  setUpdateBox({ open: false, id: null, note: "", imageUrl: "" });
};

  // Inline edit (simple)
  const [savingId, setSavingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      // For govt we’ll fetch dept projects by using query filter department=dept
      // (public endpoint supports department filter)
      const data = await projectsAPI.list({ department: dept, sort });
      setProjects(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dept) load();
  }, [dept, sort]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return projects.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (area.trim() && !(p.area || "").toLowerCase().includes(area.trim().toLowerCase())) return false;
      if (!query) return true;
      const hay = `${p.title} ${p.description} ${p.area}`.toLowerCase();
      return hay.includes(query);
    });
  }, [projects, statusFilter, area, q]);

  const createProject = async (e) => {
    e.preventDefault();
    if (!form.title || !form.startDate || !form.endDate) return;

    await projectsAPI.create({
      title: form.title,
      area: form.area,
      description: form.description,
      startDate: form.startDate,
      endDate: form.endDate,
      status: form.status,
      imageUrl: form.imageUrl
    });

    setForm({
      title: "",
      area: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "Planned",
      imageUrl: ""
    });

    await load();
  };

  const updateProject = async (id, patch) => {
    setSavingId(id);
    try {
      await projectsAPI.update(id, patch);
      await load();
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="govp-page">
      <div className="govp-header">
        <div>
          <div className="govp-city">Hubballi City</div>
          <h1>Projects Management</h1>
          <p>
            Department: <b>{dept}</b> • Create and update civic works with evidence photos.
          </p>
        </div>
        <button className="btn-sm primary" onClick={load}>Refresh</button>
      </div>

      <div className="govp-layout">
        {/* LEFT: Create */}
        <aside className="govp-create">
          <div className="card">
            <h3>Create New Project</h3>

            <form onSubmit={createProject} className="form">
              <div className="field">
                <label>Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., Road resurfacing near CBT"
                  required
                />
              </div>

              <div className="field">
                <label>Area</label>
                <input
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  placeholder="e.g., Hosur / CBT / Vidyanagar"
                />
              </div>

              <div className="field">
                <label>Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short summary of scope and expected outcome…"
                />
              </div>

              <div className="row2">
                <div className="field">
                  <label>Start date *</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    required
                  />
                </div>

                <div className="field">
                  <label>End date *</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="row2">
                <div className="field">
                  <label>Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    {allowedStatus.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="field">
                  <label>Image URL (demo)</label>
                  <input
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="/images/projects/road.jpg"
                  />
                </div>
              </div>

              <button className="btn-sm primary" type="submit">Create Project</button>
              <div className="hint">Note: images are mocked via URL for demo.</div>
            </form>
          </div>
        </aside>

        {/* RIGHT: List */}
        <section className="govp-list">
          <div className="card">
            <div className="filters">
              <div className="field">
                <label>Sort</label>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="new">Newest</option>
                  <option value="old">Oldest</option>
                </select>
              </div>

              <div className="field">
                <label>Status</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">All</option>
                  {allowedStatus.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="field">
                <label>Area</label>
                <input value={area} onChange={(e) => setArea(e.target.value)} placeholder="CBT / Hosur…" />
              </div>

              <div className="field grow">
                <label>Search</label>
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="title/description…" />
              </div>
            </div>
          </div>

          {loading && <div className="card" style={{ marginTop: "1rem" }}>Loading…</div>}

          {!loading && filtered.map((p) => (
            <div className="card" style={{ marginTop: "1rem" }} key={p.id}>
              <div className="topline">
                <div>
                  <div className="title">{p.title}</div>
                  <div className="meta">{p.department} • {p.area || "N/A"}</div>
                  <div className="chip-row">
                    <span className="badge">{fmt(p.startDate)} – {fmt(p.endDate)}</span>
                    <span className="badge blue">{p.status}</span>
                  </div>
                </div>

                <div className="actions">
                  <label className="mini">Status</label>
                  <select
                    className="select-sm"
                    value={p.status}
                    disabled={savingId === p.id}
                    onChange={(e) => updateProject(p.id, { status: e.target.value })}
                  >
                    {allowedStatus.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="project-body">
                {p.imageUrl && (
                  <div className="project-image-wrap">
                    <img className="project-image" src={p.imageUrl} alt="Project" />
                  </div>
                )}

                <div className="project-desc">
                  <b>Description</b>
                  <p>{p.description || "No description available."}</p>
{Array.isArray(p.updates) && p.updates.length > 0 && (
  <div className="updates">
    <div className="updates-title">Recent Updates</div>

    {p.updates.slice(0, 3).map((u, i) => (
      <div className="update-item" key={i}>
        <div className="update-meta">
          <span className="badge">{new Date(u.at).toLocaleString("en-IN")}</span>
          <span className="badge blue">by {u.by}</span>
        </div>

        <div className="update-note">{u.note}</div>

        {u.imageUrl && (
          <img className="update-image" src={u.imageUrl} alt="Update" />
        )}
      </div>
    ))}
  </div>
)}
                 
                  <div className="edit-row">
                    <button
                    className="btn-sm"
                    onClick={() => setUpdateBox({ open: true, id: p.id, note: "", imageUrl: "" })}
                    >
                    Post Progress Update
                    </button>
                  </div>
                </div>
              </div>
              {updateBox.open && (
  <div className="modal-backdrop" onClick={() => setUpdateBox({ open:false, id:null, note:"", imageUrl:"" })}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <h3>Post Progress Update</h3>

      <div className="field">
        <label>Update note *</label>
        <textarea
          rows={4}
          value={updateBox.note}
          onChange={(e) => setUpdateBox({ ...updateBox, note: e.target.value })}
          placeholder="e.g., Site inspection done. Materials delivered. Work starts tomorrow."
        />
      </div>

      <div className="field">
        <label>Update photo URL (optional)</label>
        <input
          value={updateBox.imageUrl}
          onChange={(e) => setUpdateBox({ ...updateBox, imageUrl: e.target.value })}
          placeholder="/images/projects/update1.jpg"
        />
      </div>

      <div className="modal-actions">
        <button className="btn-sm primary" onClick={postUpdate}>Publish</button>
        <button className="btn-sm" onClick={() => setUpdateBox({ open:false, id:null, note:"", imageUrl:"" })}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
            </div>
          ))}

          {!loading && filtered.length === 0 && (
            <div className="card" style={{ marginTop: "1rem" }}>No projects match your filters.</div>
          )}
        </section>
      </div>
      
    </div>
  );
}