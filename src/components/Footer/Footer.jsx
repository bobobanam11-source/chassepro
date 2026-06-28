import { Link } from "react-router-dom";
import { Share2, Camera, PlayCircle, Mail, Phone, MapPin, ArrowRight } from "lucide-react";

const socials = [
  { Icon: Share2, label: "Facebook" },
  { Icon: Camera, label: "Instagram" },
  { Icon: PlayCircle, label: "Youtube" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#0a1a0f", color: "#F5F0E8" }}>
      {/* Top section */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "64px 24px 48px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 48,
        }}
      >
        {/* Col 1 */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#1B3A2D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              🎯
            </div>
            <span
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: 20,
                fontWeight: 800,
                color: "white",
              }}
            >
              Garminchasse
            </span>
          </div>
          <p style={{ color: "rgba(245,240,232,0.5)", fontSize: 13, lineHeight: 1.7, marginBottom: 20, maxWidth: 220 }}>
            Votre spécialiste en équipements de chasse depuis 2005. Sélection d'experts pour des passionnés.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            {socials.map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(245,240,232,0.6)",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#E07B2A";
                  e.currentTarget.style.borderColor = "#E07B2A";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "rgba(245,240,232,0.6)";
                }}
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Col 2 */}
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(245,240,232,0.35)", marginBottom: 18 }}>
            Informations
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {["Conditions générales", "Mentions légales", "FAQ", "Livraison & Retours", "Programme fidélité", "Nous contacter"].map((item) => (
              <li key={item}>
                <Link
                  to="/contact"
                  style={{
                    color: "rgba(245,240,232,0.55)",
                    textDecoration: "none",
                    fontSize: 13,
                    transition: "color 0.15s",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#E07B2A"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(245,240,232,0.55)"; }}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(245,240,232,0.35)", marginBottom: 18 }}>
            Nos rayons
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "🧥 Vêtements", cat: "Vêtements" },
              { label: "👢 Chaussures", cat: "Chaussures" },
              { label: "🐕 Chien de chasse", cat: "Chien de chasse" },
              { label: "🔭 Optique & Repérage", cat: "Optique & Repérage" },
              { label: "🌲 Aménagement", cat: "Aménagement territoire" },
            ].map((item) => (
              <li key={item.cat}>
                <Link
                  to={`/catalogue?categorie=${encodeURIComponent(item.cat)}`}
                  style={{
                    color: "rgba(245,240,232,0.55)",
                    textDecoration: "none",
                    fontSize: 13,
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#E07B2A"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(245,240,232,0.55)"; }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(245,240,232,0.35)", marginBottom: 18 }}>
            Contact
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
            {[
              { Icon: MapPin, text: "12 Rue de la Forêt\n75008 Paris, France" },
              { Icon: Phone, text: "+33 1 23 45 67 89" },
              { Icon: Mail, text: "contact@garminchasse.fr" },
            ].map(({ Icon, text }) => (
              <div key={text} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <Icon size={15} style={{ color: "#E07B2A", flexShrink: 0, marginTop: 1 }} />
                <span style={{ color: "rgba(245,240,232,0.55)", fontSize: 13, lineHeight: 1.5, whiteSpace: "pre-line" }}>
                  {text}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              background: "rgba(224,123,42,0.1)",
              border: "1px solid rgba(224,123,42,0.2)",
              borderRadius: 12,
              padding: "12px 14px",
            }}
          >
            <p style={{ color: "#E07B2A", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
              Réponse sous 24h garantie
            </p>
            <p style={{ color: "rgba(245,240,232,0.45)", fontSize: 12 }}>
              Lun–Ven : 9h–18h · Sam : 9h–13h
            </p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "20px 24px",
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <p style={{ color: "rgba(245,240,232,0.3)", fontSize: 12 }}>
          © 2025 Garminchasse — Tous droits réservés
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          {["VISA", "Mastercard", "PayPal", "Alma"].map((brand) => (
            <span
              key={brand}
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "rgba(245,240,232,0.4)",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "4px 10px",
                borderRadius: 6,
                letterSpacing: "0.05em",
              }}
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
