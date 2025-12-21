export default function AlertFilter({ selected, onChange }) {
  const filters = ["all", "high", "medium", "low"];

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        marginBottom: "20px",
      }}
    >
      {filters.map((level) => (
        <button
          key={level}
          onClick={() => onChange(level)}
          style={{
            padding: "6px 14px",
            borderRadius: "999px",
            border:
              selected === level
                ? "1px solid var(--color-primary)"
                : "1px solid var(--color-border)",
            background:
              selected === level
                ? "var(--color-primary)"
                : "transparent",
            color:
              selected === level
                ? "var(--color-text-inverse)"
                : "var(--color-text-primary)",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          {level === "all" ? "All Alerts" : level.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
