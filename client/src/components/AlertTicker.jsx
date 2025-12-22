import { useEffect, useMemo, useState } from "react";
import "../styles/alerts.css";
import { alertsAPI } from "../services/alerts.api";

export default function AlertTicker() {
  const [alerts, setAlerts] = useState([]);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await alertsAPI.list({ active: true });
      setAlerts(Array.isArray(data) ? data : []);
    };
    load();

    // light polling (judge-safe): refresh every 20s
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
  }, []);

  const active = useMemo(() => {
    const now = Date.now();
    return alerts.filter(a => {
      if (a.active === false) return false;
      if (a.status && a.status !== "Active") return false;
      const startOk = !a.startAt || new Date(a.startAt).getTime() <= now;
      const endOk = !a.endAt || new Date(a.endAt).getTime() >= now;
      return startOk && endOk;
    });
  }, [alerts]);

  if (active.length === 0) return null;

  return (
    <>
      <div className="ticker">
        <div className="ticker-inner">
        <div className="ticker-label">LIVE</div>
        <div className="ticker-track">
          <div className="ticker-marquee">
            {active.concat(active).map((a, idx) => (
              <button
                key={`${a.id}-${idx}`}
                className={`ticker-item sev-${String(a.severity || "Low").toLowerCase()}`}
                onClick={() => setOpen(a)}
                title="Click to view"
              >
                <span className="ticker-badge">{a.severity || "Notice"}</span>
                <span className="ticker-title">{a.title}</span>
                <span className="ticker-meta">• {a.area || "City"} • {a.department || "general"}</span>
              </button>
            ))}
          </div>
        </div>
        </div>
      </div>

      {open && (
        <div className="alertModalBack" onClick={() => setOpen(null)}>
          <div className="alertModal" onClick={(e) => e.stopPropagation()}>
            <div className="alertModalTop">
              <div className={`chip sev-${String(open.severity || "Low").toLowerCase()}`}>
                {open.severity || "Notice"}
              </div>
              <button className="x" onClick={() => setOpen(null)}>✕</button>
            </div>
            <h3>{open.title}</h3>
            <p>{open.message}</p>
            <div className="alertMeta">
              <span className="pill neutral">{open.area || "City-wide"}</span>
              <span className="pill neutral">{open.department || "general"}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}