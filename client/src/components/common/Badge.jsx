export default function Badge({ label, color }) {
  return (
    <span
      style={{
        background: color,
        color: "white",
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 500,
      }}
    >
      {label}
    </span>
  );
}
