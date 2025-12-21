export default function Footer() {
  return (
    <footer
      style={{
        marginTop: "40px",
        padding: "24px",
        background: "var(--color-bg-muted)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h4 style={{ marginBottom: "8px" }}>CityConnect</h4>
          <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>
            A transparent and citizen-friendly platform to improve city safety
            and public services.
          </p>
        </div>

        <div>
          <h4 style={{ marginBottom: "8px" }}>Emergency</h4>
          <p style={{ fontSize: "14px" }}>Police: 100</p>
          <p style={{ fontSize: "14px" }}>Women Helpline: 181</p>
        </div>

        <div>
          <h4 style={{ marginBottom: "8px" }}>Legal</h4>
          <p style={{ fontSize: "14px", cursor: "pointer" }}>Privacy Policy</p>
          <p style={{ fontSize: "14px", cursor: "pointer" }}>Transparency</p>
        </div>
      </div>

      <p
        style={{
          marginTop: "16px",
          fontSize: "12px",
          color: "var(--color-text-disabled)",
        }}
      >
        © 2025 CityConnect. Built for citizens.
      </p>
    </footer>
  );
}
