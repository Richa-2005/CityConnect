import { useEffect, useMemo, useState } from "react";
import "../../styles/dashboard.css";
import { complaintsAPI } from "../../services/complaints.api";
import { useAuth } from "../../context/AuthContext";

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [complaintsNew, setComplaintsNew] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Help modal state
  const [showHelp, setShowHelp] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const cNew = await complaintsAPI.listPublic("new");
      setComplaintsNew(cNew);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    load();
  }, []);

  
  useEffect(() => {
    const key = "cc_help_seen_citizen";
    const seen = localStorage.getItem(key);
    if (!seen) {
      setShowHelp(true);
      localStorage.setItem(key, "1");
    }
  }, []);

  const myComplaints = useMemo(
    () => complaintsNew.filter((c) => c.createdBy === user?.id),
    [complaintsNew, user?.id]
  );

  const countStatus = (status) =>
    myComplaints.filter((c) => c.status === status).length;

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

        <div className="dash-actions">
          <button className="help-cta" onClick={() => setShowHelp(true)}>
            🚀 How to use this demo
          </button>
          <span className="badge blue">DEMO • {user?.role?.toUpperCase()}</span>
        </div>
      </div>

      {/* ✅ Help Modal */}
      {showHelp && (
        <div className="modal-backdrop" onClick={() => setShowHelp(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Welcome to CityConnect (Citizen)</h3>
              <button className="modal-close" onClick={() => setShowHelp(false)}>
                ✕
              </button>
            </div>

            <p className="modal-sub">
              In 30 seconds, here’s how to explore the demo:
            </p>

            <div className="guide-big">
              <div className="guide-item-big">
                <div className="guide-step-big">1</div>
                <div>
                  <div className="guide-title-big">Raise a complaint</div>
                  <div className="guide-text-big">
                    Go to <b>Complaints</b> → submit issue with department & area.
                  </div>
                </div>
              </div>

              <div className="guide-item-big">
                <div className="guide-step-big">2</div>
                <div>
                  <div className="guide-title-big">Vote for urgent issues</div>
                  <div className="guide-text-big">
                    Open a complaint → click <b>Vote</b>. More votes = higher priority.
                  </div>
                </div>
              </div>

              <div className="guide-item-big">
                <div className="guide-step-big">3</div>
                <div>
                  <div className="guide-title-big">Track your status</div>
                  <div className="guide-text-big">
                    See status as <b>Open / In Progress / Resolved</b>.
                  </div>
                </div>
              </div>

              <div className="guide-item-big">
                <div className="guide-step-big">4</div>
                <div>
                  <div className="guide-title-big">Use Transport</div>
                  <div className="guide-text-big">
                    Enter pickup & drop → get cost-effective connected routes.
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

      <div className="grid">
        <div className="card span-12">
          <h3>My Complaints</h3>

          <div className="stat">
            <div className="value">{loading ? "—" : myComplaints.length}</div>
            <span className="badge">total</span>
          </div>

          <div className="pill-row">
            <span className="badge orange">
              Open: {loading ? "—" : countStatus("Open")}
            </span>
            <span className="badge blue">
              In Progress: {loading ? "—" : countStatus("In Progress")}
            </span>
            <span className="badge green">
              Resolved: {loading ? "—" : countStatus("Resolved")}
            </span>
          </div>

          <div className="list" style={{ marginTop: "1rem" }}>
            {loading && <div className="row">Loading…</div>}
            {!loading &&
              myComplaints.map((c) => (
                <div className="row" key={c.id}>
                  <div>
                    <div className="row-title">{c.title}</div>
                    <div className="row-meta">
                      {c.department} • {c.area || "N/A"} • {c.status}
                    </div>
                    <div className="row-desc">{c.description || "—"}</div>
                  </div>
                  <span className="badge">votes: {c.votes ?? 0}</span>
                </div>
              ))}
            {!loading && myComplaints.length === 0 && (
              <div className="row">No complaints raised yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}