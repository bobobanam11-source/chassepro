import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from "lucide-react";

const slides = [
  {
    id: 1,
    titre: "Veste Imperméable",
    marque: "Browning",
    categorie: "Vêtements techniques",
    prix: 189.99,
    prixBarre: 259.99,
    note: 4.7,
    nbAvis: 203,
    badge: "Promo",
    description: "Gore-Tex 3 couches, coupe ergonomique, 8 poches dont 2 cartouchières. La référence pour la chasse en battue.",
    image: "https://images.pexels.com/photos/1192671/pexels-photo-1192671.jpeg?auto=compress&cs=tinysrgb&w=900",
    emoji: "🧥",
    accent: "#2d6a3f",
    bg: "linear-gradient(120deg, #040d07 0%, #1B3A2D 40%, #0a0f08 100%)",
  },
  {
    id: 2,
    titre: "Bottes Pro Hunter",
    marque: "Härkila",
    categorie: "Chaussures & Bottes",
    prix: 349.0,
    prixBarre: null,
    note: 4.9,
    nbAvis: 87,
    badge: "Bestseller",
    description: "Le summum du confort pour la chasse en terrain difficile. Cuir pleine fleur, membrane GORE-TEX, semelle Vibram.",
    image: "https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg?auto=compress&cs=tinysrgb&w=900",
    emoji: "👢",
    accent: "#8B4513",
    bg: "linear-gradient(120deg, #1a0a04 0%, #2d1b0e 40%, #0a0a0a 100%)",
  },
  {
    id: 3,
    titre: "GPS Alpha 200i",
    marque: "Garmin",
    categorie: "Collier GPS chien",
    prix: 599.0,
    prixBarre: 649.0,
    note: 4.8,
    nbAvis: 154,
    badge: "Nouveau",
    description: "Suivi GPS temps réel jusqu'à 14 km. Autonomie 20h, étanche IPX7. Compatible avec la montre Garmin.",
    image: "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=900",
    emoji: "🐕",
    accent: "#1a4a7a",
    bg: "linear-gradient(120deg, #050912 0%, #0d1f3a 40%, #050912 100%)",
  },
  {
    id: 7,
    titre: "Carabine X-Bolt Pro",
    marque: "Browning",
    categorie: "Armes & Munitions",
    prix: 1899.0,
    prixBarre: null,
    note: 4.9,
    nbAvis: 67,
    badge: "Bestseller",
    description: "Carabine de chasse à verrou haute précision. Crosse synthétique légère, canon fluted, gâchette réglable.",
    image: "https://images.pexels.com/photos/421129/pexels-photo-421129.jpeg?auto=compress&cs=tinysrgb&w=900",
    emoji: "🎯",
    accent: "#1a2a3a",
    bg: "linear-gradient(120deg, #04080d 0%, #0f1e2d 40%, #04080d 100%)",
  },
  {
    id: 13,
    titre: "Strike Force 20MP",
    marque: "Browning",
    categorie: "Caméra de surveillance",
    prix: 159.0,
    prixBarre: 199.0,
    note: 4.6,
    nbAvis: 201,
    badge: "Promo",
    description: "Déclenchement ultra-rapide 0.22s, résolution 20 MP, vidéo HD. Autonomie 6 mois, étanchéité IP67.",
    image: "https://images.pexels.com/photos/1252983/pexels-photo-1252983.jpeg?auto=compress&cs=tinysrgb&w=900",
    emoji: "📷",
    accent: "#1B3A2D",
    bg: "linear-gradient(120deg, #040d07 0%, #1B3A2D 40%, #040d07 100%)",
  },
];

const badgeColor = { Nouveau: "#3B82F6", Promo: "#E07B2A", Bestseller: "#F59E0B" };

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [dir, setDir] = useState(1); // 1 = gauche→droite, -1 = droite→gauche
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback(
    (next, direction = 1) => {
      if (transitioning) return;
      const idx = ((next % slides.length) + slides.length) % slides.length;
      setDir(direction);
      setPrev(current);
      setTransitioning(true);
      setCurrent(idx);
      setTimeout(() => {
        setPrev(null);
        setTransitioning(false);
      }, 700);
    },
    [current, transitioning]
  );

  useEffect(() => {
    const t = setInterval(() => goTo(current + 1, 1), 5000);
    return () => clearInterval(t);
  }, [current, goTo]);

  const s = slides[current];

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        minHeight: 600,
        overflow: "hidden",
      }}
    >
      {/* ── FOND dynamique ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: s.bg,
          transition: "background 0.8s ease",
        }}
      />

      {/* ── PHOTO de fond (droite, masquée en mobile) ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "52%",
          height: "100%",
          overflow: "hidden",
        }}
        className="hero-img-panel"
      >
        {/* Dégradé de fusion gauche */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, ${s.bg.match(/#[0-9a-f]{6}/i)?.[0] ?? "#040d07"} 0%, transparent 35%)`,
            zIndex: 2,
            transition: "background 0.8s",
          }}
        />
        {/* Dégradé bas */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 50%)",
            zIndex: 2,
          }}
        />
        <img
          key={s.image}
          src={s.image}
          alt={s.titre}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            opacity: transitioning ? 0 : 1,
            transform: transitioning ? "scale(1.04)" : "scale(1)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
            display: "block",
          }}
          onError={(e) => { e.target.style.display = "none"; e.target.nextSibling && (e.target.nextSibling.style.display = "flex"); }}
        />
      </div>

      {/* ── OVERLAY global sombre ── */}
      <div
        className="hero-overlay"
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
          zIndex: 3,
        }}
      />

      {/* ── CONTENU ── */}
      <div
        className="hero-content"
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 40px",
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            maxWidth: 580,
            opacity: transitioning ? 0 : 1,
            transform: transitioning ? `translateX(${dir * -20}px)` : "translateX(0)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          {/* Badges */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            <span
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.85)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "5px 14px",
                borderRadius: 20,
              }}
            >
              {s.categorie}
            </span>
            {s.badge && (
              <span
                style={{
                  background: badgeColor[s.badge],
                  color: "white",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "5px 14px",
                  borderRadius: 20,
                }}
              >
                {s.badge}
              </span>
            )}
          </div>

          {/* Marque */}
          <p
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            {s.marque}
          </p>

          {/* Titre */}
          <h1
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "clamp(32px, 5vw, 64px)",
              fontWeight: 900,
              color: "white",
              lineHeight: 1.1,
              marginBottom: 16,
              letterSpacing: "-0.02em",
            }}
          >
            {s.titre}
          </h1>

          {/* Étoiles */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 3 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={15}
                  fill={star <= Math.round(s.note) ? "#E07B2A" : "none"}
                  color={star <= Math.round(s.note) ? "#E07B2A" : "rgba(255,255,255,0.25)"}
                />
              ))}
            </div>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
              {s.note} · {s.nbAvis} avis
            </span>
          </div>

          {/* Description */}
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 15,
              lineHeight: 1.7,
              marginBottom: 28,
              maxWidth: 460,
            }}
          >
            {s.description}
          </p>

          {/* Prix */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 32 }}>
            <span style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, color: "#E07B2A" }}>
              {s.prix.toFixed(2)} €
            </span>
            {s.prixBarre && (
              <>
                <span style={{ fontSize: 18, color: "rgba(255,255,255,0.3)", textDecoration: "line-through" }}>
                  {s.prixBarre.toFixed(2)} €
                </span>
                <span
                  style={{
                    background: "#E07B2A",
                    color: "white",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: 8,
                  }}
                >
                  -{Math.round((1 - s.prix / s.prixBarre) * 100)}%
                </span>
              </>
            )}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              to={`/produit/${s.id}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                borderRadius: 12,
                background: "#E07B2A",
                color: "white",
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                boxShadow: "0 6px 24px rgba(224,123,42,0.45)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#c96a1a"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#E07B2A"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <ShoppingCart size={16} /> Voir le produit
            </Link>
            <Link
              to="/catalogue"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 24px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(6px)",
                border: "1.5px solid rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.18)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
            >
              Explorer le catalogue
            </Link>
          </div>
        </div>
      </div>

      {/* ── CONTRÔLES bas ── */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 0,
          right: 0,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          padding: "0 40px",
        }}
      >
        {/* Flèche précédente */}
        <button
          onClick={() => goTo(current - 1, -1)}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            border: "1.5px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(8px)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.18)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Dots + miniatures */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {slides.map((slide, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              title={slide.titre}
              style={{
                width: i === current ? 36 : 8,
                height: 8,
                borderRadius: 4,
                border: "none",
                background: i === current ? "#E07B2A" : "rgba(255,255,255,0.3)",
                cursor: "pointer",
                transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Flèche suivante */}
        <button
          onClick={() => goTo(current + 1, 1)}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            border: "1.5px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(8px)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.18)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* ── BANDEAU défilant ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          height: 40,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(10px)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            animation: "marquee 22s linear infinite",
          }}
        >
          {[...Array(4)].flatMap((_, r) =>
            ["🚚 Livraison offerte dès 50€", "🔄 Retour gratuit 30 jours", "💳 Paiement 3x sans frais", "🏆 SAV Expert chasseur", "✅ +5000 produits en stock"].map((t, i) => (
              <span
                key={`${r}-${i}`}
                style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, paddingRight: 48, fontWeight: 500 }}
              >
                {t}
              </span>
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (max-width: 768px) {
          .hero-img-panel {
            display: block !important;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 42%;
          }
          .hero-img-panel > div:first-child { display: none !important; }
          .hero-overlay { display: none !important; }
          .hero-img-panel::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 60%);
            z-index: 3;
          }
          .hero-content {
            padding-top: 38% !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
            padding-bottom: 100px !important;
            align-items: flex-start !important;
            overflow-y: auto !important;
          }
        }
      `}</style>
    </section>
  );
}
