import { MapPin, Phone } from "lucide-react";

export default function Contact() {
  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", background: "#F7F7F5" }}>
      <div style={{ background: "linear-gradient(135deg, #0f2318 0%, #1B3A2D 100%)", padding: "56px 24px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, color: "#F5F0E8", marginBottom: 12 }}>Contactez-nous</h1>
        <p style={{ color: "rgba(245,240,232,0.7)", fontSize: 16, maxWidth: 480, margin: "0 auto" }}>
          Notre équipe est disponible pour répondre à toutes vos questions.
        </p>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.05)", display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ width: 48, height: 48, background: "#F0FDF4", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <MapPin size={20} color="#1B3A2D" />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, color: "#111", marginBottom: 4 }}>Adresse</p>
              <p style={{ fontSize: 14, color: "#6B7280" }}>Montpellier, France, 34080</p>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.05)", display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ width: 48, height: 48, background: "#F0FDF4", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Phone size={20} color="#1B3A2D" />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, color: "#111", marginBottom: 4 }}>Téléphone</p>
              <p style={{ fontSize: 14, color: "#6B7280" }}>+33 7 57 75 43 53</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
