import { useEffect, useMemo, useState } from "react";
import "../styles/alerts.css";
import { alertsAPI } from "../services/alerts.api";
import AlertDetailsModal from "./AlertDetailsModal";

export default function AlertFooter() {
  const [alerts, setAlerts] = useState([]);
  const [dismissed, setDismissed] = useState(false);
const [open, setOpen] = useState(false);
  useEffect(() => {
    const load = async () => {
      const data = await alertsAPI.list({ active: true });
      setAlerts(Array.isArray(data) ? data : []);
    };
    load();
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
  }, []);

  const top = useMemo(() => {
    const now = Date.now();
    const active = alerts.filter(a => {
      if (a.active === false) return false;
      if (a.status && a.status !== "Active") return false;
      const startOk = !a.startAt || new Date(a.startAt).getTime() <= now;
      const endOk = !a.endAt || new Date(a.endAt).getTime() >= now;
      return startOk && endOk;
    });

    // priority: Critical > High > Medium > Low, then newest
    const rank = (sev) => ({ critical: 4, high: 3, medium: 2, low: 1 }[String(sev||"").toLowerCase()] || 0);
    active.sort((a,b) => rank(b.severity) - rank(a.severity) || (new Date(b.createdAt) - new Date(a.createdAt)));

    return active[0] || null;
  }, [alerts]);

  // if new alert comes, show again
  useEffect(() => {
    setDismissed(false);
  }, [top?.id]);

  if (!top || dismissed) return null;

return (
  <>
    <div
      className={`alertFooter sev-${String(top.severity||"low").toLowerCase()}`}
      onClick={() => setOpen(true)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
    >
      <div className="alertFooter-inner">
        <div className="alertFooter-left">
          <span className="alertFooter-tag">ALERT</span>
          <span className="alertFooter-title">{top.title}</span>
          <span className="alertFooter-meta">• {top.area || "City"} • {top.department || "general"}</span>
        </div>

        <div className="alertFooter-right" onClick={(e) => e.stopPropagation()}>
          <span className="pill neutral">{top.severity}</span>

          <button className="btn-sm primary" onClick={() => setOpen(true)}>View</button>

          <button className="btn-sm" onClick={() => setDismissed(true)}>Dismiss</button>
        </div>
      </div>
    </div>

    <AlertDetailsModal alert={open ? top : null} onClose={() => setOpen(false)} />
  </>
);
}