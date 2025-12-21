export default function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
}) {
  const styles = {
    primary: {
      background: "var(--color-primary)",
      color: "var(--color-text-inverse)",
      border: "none",
    },
    outline: {
      background: "transparent",
      border: "1px solid var(--color-primary)",
      color: "var(--color-primary)",
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        ...styles[variant],
        padding: "10px 18px",
        borderRadius: "var(--radius-btn)",
        cursor: "pointer",
        fontWeight: 500,
      }}
    >
      {children}
    </button>
  );
}
