import { useEffect, useMemo, useState } from "react";
import "../../styles/dashboard.css";
import { complaintsAPI } from "../../services/complaints.api";
import { useAuth } from "../../context/AuthContext";

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [complaintsNew, setComplaintsNew] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const cNew = await complaintsAPI.listPublic("new");
      setComplaintsNew(cNew);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const myComplaints = useMemo(
    () => complaintsNew.filter((c) => c.createdBy === user?.id),
    [complaintsNew, user?.id]
  );

  const countStatus = (status) => myComplaints.filter((c) => c.status === status).length;

  return (
    <div className="dash">
      <div className="dash-top">
        <div>
          <div className="dash-city">Hubballi City</div>
          <div className="dash-title">Citizen Dashboard</div>

          <div className="dash-subtitle">
            Track your issues and civic updates.
          </div>

          <div className="dash-username">
            Logged in as <b>{user?.name}</b> ({user?.id})
          </div>
        </div>

        <span className="badge blue">{user?.role}</span>
      </div>

      {/* Manual Guide (Top) */}
      <div className="card span-12" style={{ marginBottom: "1rem" }}>
        <h3>How to use CityConnect</h3>
        <div className="guide">
          <div className="guide-item">
            <div className="guide-step">1</div>
            <div>
              <div className="guide-title">Raise a complaint</div>
              <div className="guide-text">Go to <b>Complaints</b> tab → Add issue with department & area.</div>
            </div>
          </div>

          <div className="guide-item">
            <div className="guide-step">2</div>
            <div>
              <div className="guide-title">Vote for urgent issues</div>
              <div className="guide-text">Open any complaint → click <b>Vote</b>. Higher votes = higher priority.</div>
            </div>
          </div>

          <div className="guide-item">
            <div className="guide-step">3</div>
            <div>
              <div className="guide-title">Track your complaint status</div>
              <div className="guide-text">See your complaint status as <b>Open / In Progress / Resolved</b>.</div>
            </div>
          </div>

          <div className="guide-item">
            <div className="guide-step">4</div>
            <div>
              <div className="guide-title">View city projects</div>
              <div className="guide-text">Use <b>Projects</b> tab to see ongoing/complete works in your area.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid">
        {/* Keep My Complaints on Home */}
        <div className="card span-12">
          <h3>My Complaints</h3>

          <div className="stat">
            <div className="value">{loading ? "—" : myComplaints.length}</div>
            <span className="badge">total</span>
          </div>

          <div className="pill-row">
            <span className="badge orange">Open: {loading ? "—" : countStatus("Open")}</span>
            <span className="badge blue">In Progress: {loading ? "—" : countStatus("In Progress")}</span>
            <span className="badge green">Resolved: {loading ? "—" : countStatus("Resolved")}</span>
          </div>

          <div className="list" style={{ marginTop: "1rem" }}>
            {loading && <div className="row">Loading…</div>}
            {!loading && myComplaints.map((c) => (
              <div className="row" key={c.id}>
                <div>
                  <div className="row-title">{c.title}</div>
                  <div className="row-meta">{c.department} • {c.area || "N/A"} • {c.status}</div>
                  <div className="row-desc">{c.description || "—"}</div>
                </div>
                <span className="badge">votes: {c.votes ?? 0}</span>
              </div>
            ))}
            {!loading && myComplaints.length === 0 && <div className="row">No complaints raised yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}