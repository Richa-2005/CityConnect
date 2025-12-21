export default function Card({ children }) {
  return (
    <div
      style={{
        background: "var(--color-bg-card)",
        borderRadius: "var(--radius-card)",
        padding: "16px",
        boxShadow: "var(--shadow-soft)",
        border: "1px solid var(--color-border)",
      }}
    >
      {children}
    </div>
  );
}
