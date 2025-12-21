import Card from "../common/Card";
import SeverityTag from "./SeverityTag";

export default function ComplaintCard({
  title,
  category,
  location,
  severity,
  status,
}) {
  return (
    <Card>
      {/* Top row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <h3 style={{ fontSize: "16px" }}>{title}</h3>
        <SeverityTag level={severity} />
      </div>

      {/* Details */}
      <p
        style={{
          fontSize: "14px",
          color: "var(--color-text-secondary)",
          marginBottom: "6px",
        }}
      >
        {category} • {location}
      </p>

      {/* Status */}
      <p
        style={{
          fontSize: "14px",
          fontWeight: 500,
          color:
            status === "Resolved"
              ? "var(--color-success)"
              : "var(--color-warning)",
        }}
      >
        Status: {status}
      </p>
    </Card>
  );
}
