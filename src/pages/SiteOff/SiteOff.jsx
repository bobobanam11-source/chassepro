export default function SiteOff() {
  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 24, padding: 24, textAlign: "center",
    }}>
      <div style={{ fontSize: 80 }}>❌</div>
      <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(24px,5vw,42px)", fontWeight: 800, color: "#fff", margin: 0 }}>
        Site temporairement indisponible
      </h1>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, maxWidth: 400, lineHeight: 1.6 }}>
        Ce site est actuellement hors service. Veuillez réessayer plus tard.
      </p>
    </div>
  );
}
