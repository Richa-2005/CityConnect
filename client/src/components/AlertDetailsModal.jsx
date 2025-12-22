import "../styles/alerts.css";

export default function AlertDetailsModal({ alert, onClose }) {
  if (!alert) return null;

  return (
    <div className="alertModalWrap" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="alertModal" onClick={(e) => e.stopPropagation()}>
        <div className="alertModalTop">
          <div>
            <div className="alertModalTag">ALERT</div>
            <h3 className="alertModalTitle">{alert.title}</h3>
            <div className="alertModalMeta">
              {alert.area || "City"} • {alert.department || "general"} • {alert.severity || "Low"}
            </div>
          </div>

          <button className="alertModalClose" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="alertModalBody">
          <p className="alertModalMsg">{alert.message}</p>

          <div className="alertModalChips">
            <span className="pill neutral">{alert.severity}</span>
            {alert.area && <span className="pill neutral">{alert.area}</span>}
            {alert.department && <span className="pill neutral">{alert.department}</span>}
          </div>

          {(alert.startAt || alert.endAt) && (
            <div className="alertModalTime">
              <span><b>Active:</b> {alert.startAt ? new Date(alert.startAt).toLocaleString() : "Now"}</span>
              <span> → </span>
              <span>{alert.endAt ? new Date(alert.endAt).toLocaleString() : "Until further notice"}</span>
            </div>
          )}
        </div>

        <div className="alertModalActions">
          <button className="btn-sm primary" onClick={onClose}>Got it</button>
        </div>
      </div>
    </div>
  );
}