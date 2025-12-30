import { useEffect, useMemo, useState } from "react";
import "../../styles/authorityAlerts.css";
import { alertsAPI } from "../../services/alerts.api";
import { useAuth } from "../../context/AuthContext";

const SEVERITIES = ["Low", "Medium", "High", "Critical"];
const DEPTS = ["general", "roads", "electricity", "water", "transport"];

export default function AuthorityAlerts() {
  const { user } = useAuth();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    message: "",
    severity: "Medium",
    department: "general",
    area: "",
    endsAt: "", // datetime-local string
    active: true
  });

  const load = async () => {
    setLoading(true);
    try {
      const data = await alertsAPI.listAll();
      setList(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
      startsAt: new Date().toISOString(),
      tags: [form.area, form.department].filter(Boolean)
    };
    await alertsAPI.create(payload);
    setForm({ title: "", message: "", severity: "Medium", department: "general", area: "", endsAt: "", active: true });
    load();
  };

  const toggle = async (a) => {
    await alertsAPI.update(a.id, { active: !a.active });
    load();
  };

  const remove = async (a) => {
    if (!confirm(`Delete alert "${a.title}"?`)) return;
    await alertsAPI.remove(a.id);
    load();
  };

  const activeNow = useMemo(() => list.filter(a => a.active), [list]);

  return (
    <div className="authority-alerts">
    <div className="dash">
      <div className="dash-top">
        <div>
          <div className="dash-city">HUBBALLI CITY</div>
          <div className="dash-title">Alerts Control</div>
          <div className="dash-subtitle">
            Welcome, <b>{user?.name}</b> • Create & manage city-wide notices.
          </div>
        </div>
      </div>

      <div className="grid12">
        <div className="card span6">
          <h3>Create New Alert</h3>

          <form className="form" onSubmit={submit}>
            <input
              className="input"
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="Alert title (e.g., Road closure near CBT)"
              required
            />

            <textarea
              className="textarea"
              name="message"
              value={form.message}
              onChange={onChange}
              placeholder="Details (what happened + what citizens should do)"
              rows={4}
            />

            <div className="row2">
              <label className="label">
                Severity
                <select className="select" name="severity" value={form.severity} onChange={onChange}>
                  {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>

              <label className="label">
                Department
                <select className="select" name="department" value={form.department} onChange={onChange}>
                  {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </label>
            </div>

            <div className="row2">
              <label className="label">
                Area (optional)
                <input className="input" name="area" value={form.area} onChange={onChange} placeholder="CBT / Vidyanagar / ..." />
              </label>

              <label className="label">
                Ends at (optional)
                <input className="input" type="datetime-local" name="endsAt" value={form.endsAt} onChange={onChange} />
              </label>
            </div>

            <button className="btn primary">Publish Alert</button>

            <div className="hint">
              Published alerts instantly appear in the LIVE ticker + footer across dashboards.
            </div>
          </form>
        </div>

        <div className="card span6">
          <h3>Active Alerts</h3>
          <div className="list">
            {loading && <div className="row">Loading…</div>}
            {!loading && activeNow.length === 0 && <div className="row">No active alerts right now.</div>}

            {!loading && activeNow.map(a => (
              <div className="row" key={a.id}>
                <div>
                  <div className="row-title">{a.title}</div>
                  <div className="row-meta">{a.severity} • {a.department} • {a.area || "City"}</div>
                  {a.message && <div className="row-desc">{a.message}</div>}
                </div>

                <div className="actions">
                  <button className="btn-sm" type="button" onClick={() => toggle(a)}>
                    Deactivate
                  </button>
                  <button className="btn-sm danger" type="button" onClick={() => remove(a)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ marginTop: "1rem" }}>All Alerts</h3>
          <div className="list">
            {!loading && list.map(a => (
              <div className="row" key={a.id}>
                <div>
                  <div className="row-title">{a.title}</div>
                  <div className="row-meta">
                    {a.active ? "ACTIVE" : "INACTIVE"} • {a.severity} • {a.department} • {a.area || "City"}
                  </div>
                </div>
                <div className="actions">
                  <button className="btn-sm" type="button" onClick={() => toggle(a)}>
                    {a.active ? "Deactivate" : "Activate"}
                  </button>
                  <button className="btn-sm danger" type="button" onClick={() => remove(a)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
    </div>
  );
}