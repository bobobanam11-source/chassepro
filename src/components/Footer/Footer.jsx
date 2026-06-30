import { Link } from "react-router-dom";
import { MapPin, Phone } from "lucide-react";
import { useData } from "../../context/DataContext";

export default function Footer() {
  const { categories } = useData();

  return (
    <footer style={{ background: "#0a1a0f", color: "#F5F0E8" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 32px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40 }}>

        {/* Logo */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#1B3A2D", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎯</div>
            <span style={{ fontFamily: "Playfair Display, serif", fontSize: 20, fontWeight: 800, color: "white" }}>Garminchasse</span>
          </div>
          <p style={{ color: "rgba(245,240,232,0.5)", fontSize: 13, lineHeight: 1.7, maxWidth: 220 }}>
            Votre spécialiste en équipements de chasse. Sélection d'experts pour des passionnés.
          </p>
        </div>

        {/* Catégories */}
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(245,240,232,0.35)", marginBottom: 16 }}>Nos rayons</p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  to={`/catalogue?categorie=${encodeURIComponent(cat.nom)}`}
                  style={{ color: "rgba(245,240,232,0.55)", textDecoration: "none", fontSize: 13, transition: "color 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#E07B2A"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(245,240,232,0.55)"; }}
                >
                  {cat.nom}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(245,240,232,0.35)", marginBottom: 16 }}>Contact</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <MapPin size={15} style={{ color: "#E07B2A", flexShrink: 0, marginTop: 1 }} />
              <span style={{ color: "rgba(245,240,232,0.55)", fontSize: 13, lineHeight: 1.5 }}>Montpellier, France, 34080</span>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Phone size={15} style={{ color: "#E07B2A", flexShrink: 0 }} />
              <span style={{ color: "rgba(245,240,232,0.55)", fontSize: 13 }}>+33 7 57 75 43 53</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "16px 24px", maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <p style={{ color: "rgba(245,240,232,0.3)", fontSize: 12 }}>© 2025 Garminchasse — Tous droits réservés</p>
        <div style={{ display: "flex", gap: 8 }}>
          {["VISA", "Mastercard", "PayPal"].map((brand) => (
            <span key={brand} style={{ fontSize: 11, fontWeight: 700, color: "rgba(245,240,232,0.4)", border: "1px solid rgba(255,255,255,0.1)", padding: "4px 10px", borderRadius: 6 }}>{brand}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
