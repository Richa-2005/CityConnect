export default function ComplaintTimeline({ steps }) {
  return (
    <div style={{ marginTop: "16px" }}>
      {steps.map((step, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          {/* Dot */}
          <div
            style={{
              width: "10px",
              height: "10px",
              marginTop: "6px",
              borderRadius: "50%",
              background: step.completed
                ? "var(--color-success)"
                : "var(--color-border)",
            }}
          />

          {/* Text */}
          <div>
            <p style={{ fontWeight: 500 }}>{step.label}</p>
            <p
              style={{
                fontSize: "13px",
                color: "var(--color-text-secondary)",
              }}
            >
              {step.date}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
