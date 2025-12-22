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
            Find the cheapest route with exact bus/train instructions and transfers.
          </div>
        </div>
      </div>

      <div className="card transport-card">
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