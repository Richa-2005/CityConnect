import Card from "../common/Card";
import Badge from "../common/Badge";

export default function AlertCard({
  title,
  description,
  severity,
  location,
  time,
  authority = true,
}) {
  const severityColor = {
    high: "var(--color-error)",
    medium: "var(--color-warning)",
    low: "var(--color-info)",
  };

  return (
    <Card>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <h3 style={{ fontSize: "16px" }}>{title}</h3>
        <Badge label={severity.toUpperCase()} color={severityColor[severity]} />
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: "14px",
          color: "var(--color-text-secondary)",
          marginBottom: "10px",
        }}
      >
        {description}
      </p>

      {/* Meta info */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "13px",
          color: "var(--color-text-secondary)",
        }}
      >
        <span>📍 {location}</span>
        <span>{time}</span>
      </div>

      {/* Authority */}
      {authority && (
        <p
          style={{
            marginTop: "8px",
            fontSize: "12px",
            color: "var(--color-success)",
          }}
        >
          ✔ Verified by Authority
        </p>
      )}
    </Card>
  );
}

