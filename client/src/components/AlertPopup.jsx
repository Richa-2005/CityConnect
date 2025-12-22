import { useEffect, useMemo, useState } from "react";
import "../styles/alerts.css";
import { alertsAPI } from "../services/alerts.api";

export default function AlertPopup() {
  const [alerts, setAlerts] = useState([]);
  const [show, setShow] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await alertsAPI.list({ active: true });
      setAlerts(Array.isArray(data) ? data : []);
    };
    load();
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
  }, []);

  const highCritical = useMemo(() => {
    const now = Date.now();
    const eligible = alerts.filter(a => {
      const sev = String(a.severity || "").toLowerCase();
      if (!(sev === "high" || sev === "critical")) return false;
      if (a.active === false) return false;
      if (a.status && a.status !== "Active") return false;
      const startOk = !a.startAt || new Date(a.startAt).getTime() <= now;
      const endOk = !a.endAt || new Date(a.endAt).getTime() >= now;
      return startOk && endOk;
    });

    // show newest first
    eligible.sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt));
    return eligible;
  }, [alerts]);

  useEffect(() => {
    if (!highCritical.length) return;

    const latest = highCritical[0];
    const seenKey = `seen_alert_${latest.id}`;
    if (sessionStorage.getItem(seenKey)) return;

    sessionStorage.setItem(seenKey, "1");
    setShow(latest);
  }, [highCritical]);

  if (!show) return null;

  return (
    <div className="popupWrap" onClick={() => setShow(null)}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <div className="popupHead">
          <span className="popupTag">ALERT! NOTICE!</span>
          <button className="x" onClick={() => setShow(null)}>✕</button>
        </div>
        <div className="popupTitle">{show.title}</div>
        <div className="popupMsg">{show.message}</div>
        <div className="alertMeta">
          <span className="pill warning">{show.severity}</span>
          <span className="pill neutral">{show.area || "City-wide"}</span>
          <span className="pill neutral">{show.department || "general"}</span>
        </div>
      </div>
    </div>
  );
}