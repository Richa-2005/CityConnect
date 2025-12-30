import { useEffect, useMemo, useState } from "react";
import "../../styles/transport.css";
import { transportAPI } from "../../services/transport.api";

export default function Transport() {
  const [stops, setStops] = useState([]);
  const [loadingStops, setLoadingStops] = useState(true);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [finding, setFinding] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");

  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
  const key = "cc_help_seen_transport";
  const seen = localStorage.getItem(key);
  if (!seen) {
    setShowHelp(true);
    localStorage.setItem(key, "1");
  }
}, []);

  useEffect(() => {
    const load = async () => {
      setLoadingStops(true);
      try {
        const data = await transportAPI.stops();
        setStops(data);
        if (data?.length >= 2) {
          setFrom(data[0].id);
          setTo(data[1].id);
        }
      } finally {
        setLoadingStops(false);
      }
    };
    load();
  }, []);

  const canFind = useMemo(() => from && to && from !== to, [from, to]);
  const samples = useMemo(() => {
  if (!stops?.length) return [];
  
  const s0 = stops[0];
  const s3 = stops[3] || stops[1];
  const s5 = stops[5] || stops[2];
  return [
    { label: "College → Railway Station", from: s0?.id, to: s3?.id },
    { label: "BRTS Stop → Central Market", from: s3?.id, to: s5?.id },
    { label: "Bus Stand → Airport (last-mile)", from: s5?.id, to: s0?.id },
  ].filter(x => x.from && x.to && x.from !== x.to);
}, [stops]);

  const onFind = async () => {
    if (!canFind) return;
    setErr("");
    setResult(null);
    setFinding(true);
    try {
      const data = await transportAPI.path(from, to);
      setResult(data);
    } catch (e) {
      setErr(e?.response?.data?.error || "Unable to find route");
    } finally {
      setFinding(false);
    }
  };

  return (
    <div className="dash">
     <div className="dash-top">
  <div>
    <div className="dash-city">HUBBALLI CITY</div>
    <div className="dash-title">Public Transport Planner</div>
    <div className="dash-subtitle">
      Cost-effective routes with connected steps + aligned timings.
    </div>
  </div>

  <div className="dash-actions">
    <button className="help-cta" onClick={() => setShowHelp(true)}>
      🚀 How to use this demo
    </button>
    <span className="badge blue">DEMO • TRANSPORT</span>
  </div>
</div>
{showHelp && (
  <div className="modal-backdrop" onClick={() => setShowHelp(false)}>
    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
      <div className="modal-head">
        <h3>🚌 CityConnect — Transport Quick Guide</h3>
        <button className="modal-close" onClick={() => setShowHelp(false)}>
          ✕
        </button>
      </div>

      <p className="modal-sub">
        Enter pickup & drop → get <b>connected public transport legs</b> with timing and cost.
      </p>

      <div className="guide-big">
        <div className="guide-item-big">
          <div className="guide-step-big">1</div>
          <div>
            <div className="guide-title-big">Pick From and To</div>
            <div className="guide-text-big">
              Choose locations (stops + areas) from the dropdowns.
            </div>
          </div>
        </div>

        <div className="guide-item-big">
          <div className="guide-step-big">2</div>
          <div>
            <div className="guide-title-big">Generate connected route</div>
            <div className="guide-text-big">
              Click <b>Find Route</b> → see multi-leg path (Bus → Metro → etc.).
            </div>
          </div>
        </div>

        <div className="guide-item-big">
          <div className="guide-step-big">3</div>
          <div>
            <div className="guide-title-big">Timing alignment</div>
            <div className="guide-text-big">
              Each leg shows <b>travel time</b> + <b>frequency</b> for realistic transfers.
            </div>
          </div>
        </div>

        <div className="guide-item-big">
          <div className="guide-step-big">4</div>
          <div>
            <div className="guide-title-big">Cost-effective choice</div>
            <div className="guide-text-big">
              Summary shows total cost + transfers so users avoid unnecessary cabs.
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

      <div className="card transport-card">
        {samples.length > 0 && (
  <div className="sample-row">
    <span className="muted">Try a sample:</span>
    {samples.map((s) => (
      <button
        key={s.label}
        type="button"
        className="sample-chip"
        onClick={async () => {
          setFrom(s.from);
          setTo(s.to);
          // run after state updates settle
          setTimeout(() => onFind(), 0);
        }}
      >
        {s.label}
      </button>
    ))}
  </div>
)}
        <div className="transport-form">
          <div className="field">
            <label>From</label>
            <select value={from} onChange={(e) => setFrom(e.target.value)} disabled={loadingStops}>
              {stops.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.area}
                </option>
              ))}
            </select>
          </div>

          <div className="swap-wrap">
            <button
              className="btn-sm"
              type="button"
              onClick={() => {
                const a = from;
                setFrom(to);
                setTo(a);
              }}
              disabled={!from || !to}
              title="Swap"
            >
              ⇄
            </button>
          </div>

          <div className="field">
            <label>To</label>
            <select value={to} onChange={(e) => setTo(e.target.value)} disabled={loadingStops}>
              {stops.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.area}
                </option>
              ))}
            </select>
          </div>

          <div className="action">
            <button className="btn-sm primary" onClick={onFind} disabled={!canFind || finding}>
              {finding ? "Finding..." : "Find Route"}
            </button>
          </div>
        </div>

        {err && <div className="transport-error">{err}</div>}
      </div>

      {result && (
        <div className="grid">
          <div className="card span-12">
            <div className="transport-summary">
              <div>
                <div className="sum-title">Route Summary</div>
                <div className="sum-meta">
                  {result.from?.name} → {result.to?.name}
                </div>
              </div>

              <div className="sum-pills">
                <span className="pill neutral">Total Cost: {result.totalCost}</span>
                <span className="pill blue">Transfers: {result.transfers}</span>
                <span className="pill green">Stops: {result.path?.length}</span>
              </div>
            </div>
          </div>

          <div className="card span-12">
            <div className="sum-title">Step-by-step Instructions</div>

            <div className="timeline">
              {result.journey?.map((leg, idx) => {
                const label = `${leg.mode}${leg.routeNo ? " " + leg.routeNo : ""}`;
                return (
                  <div className="tl-row" key={idx}>
                    <div className="tl-dot" />
                    <div className="tl-card">
                      <div className="tl-top">
                        <div className="tl-route">
                          <span className="pill warning">{label}</span>
                          
                          {leg.routeName ? <span className="tl-rname">{leg.routeName}</span> : null}
                        </div>
                        <span className="pill neutral">Cost: {leg.cost}</span>
                      </div>
                      <div className="tl-time">
  ⏱ {leg.travelTimeMins || "—"} mins
  <span className="muted"> • Every {leg.frequencyMins || "—"} mins</span>
  {leg.operatingHours ? (
    <span className="muted"> • 🕒 {leg.operatingHours}</span>
  ) : null}
</div>

                      <div className="tl-stops">
                        <b>{leg.from?.name}</b> <span className="muted">({leg.from?.area})</span>
                        <span className="arrow">→</span>
                        <b>{leg.to?.name}</b> <span className="muted">({leg.to?.area})</span>
                      </div>

                      <div className="tl-instr">{result.instructions?.[idx]}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}