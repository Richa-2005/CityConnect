import { useState } from "react";
import AlertCard from "../components/alerts/AlertCard";
import AlertFilter from "../components/alerts/AlertFilter";

export default function Alerts() {
  const [filter, setFilter] = useState("all");

  const alerts = [
    {
      title: "Water logging reported",
      description: "Heavy rain causing water accumulation on main road.",
      severity: "high",
      location: "Sector 5, Ward 11",
      time: "10 mins ago",
    },
    {
      title: "Traffic diversion",
      description: "Road repair work in progress.",
      severity: "medium",
      location: "MG Road",
      time: "1 hour ago",
    },
    {
      title: "Streetlight maintenance",
      description: "Routine maintenance scheduled.",
      severity: "low",
      location: "Park Street",
      time: "Today",
    },
  ];

  const filteredAlerts =
    filter === "all"
      ? alerts
      : alerts.filter((a) => a.severity === filter);

  return (
    <div className="container" style={{ padding: "32px 0" }}>
      <h2 style={{ marginBottom: "8px" }}>City Alerts</h2>
      <p
        style={{
          color: "var(--color-text-secondary)",
          marginBottom: "20px",
        }}
      >
        Real-time updates verified by authorities to help you stay safe.
      </p>

      <AlertFilter selected={filter} onChange={setFilter} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "16px",
        }}
      >
        {filteredAlerts.map((alert, index) => (
          <AlertCard key={index} {...alert} />
        ))}
      </div>
    </div>
  );
}
