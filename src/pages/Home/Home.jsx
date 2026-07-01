import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Mail, Search } from "lucide-react";
import HeroCarousel from "../../components/Banner/HeroCarousel";
import ProductCard from "../../components/ProductCard/ProductCard";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import { useData } from "../../context/DataContext";

function SectionTitle({ label, title, subtitle, light = false }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-3">
        <span
          style={{
            width: 32,
            height: 3,
            borderRadius: 2,
            background: "#E07B2A",
            display: "inline-block",
          }}
        />
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#E07B2A",
          }}
        >
          {label}
        </span>
      </div>
      <h2
        className="font-playfair"
        style={{
          fontSize: "clamp(26px, 4vw, 38px)",
          fontWeight: 800,
          color: light ? "#F5F0E8" : "#111827",
          lineHeight: 1.2,
          marginBottom: 10,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p style={{ color: light ? "rgba(245,240,232,0.6)" : "#6B7280", fontSize: 15 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("Toutes");
  const [filterPrice, setFilterPrice] = useState("");
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const { products, categories, marques } = useData();

  const topRated = [...products].sort((a, b) => (b.note || 0) - (a.note || 0)).slice(0, 8);
  const promos = products.filter((p) => p.prix_barre !== null && p.prix_barre !== undefined && Number(p.prix_barre) > 0).slice(0, 4);
  const allCategories = ["Toutes", ...categories.map((c) => c.nom)];
  const brands = marques.map((m) => ({ name: m.nom.toUpperCase(), color: "#1B3A2D" }));

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    if (filterCat !== "Toutes") params.set("categorie", filterCat);
    if (filterPrice) params.set("prix", filterPrice);
    navigate(`/categories?${params.toString()}`);
  };

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 300, behavior: "smooth" });
    }
  };

  return (
    <div style={{ background: "#fafafa" }}>
      {/* ── HERO CAROUSEL ── */}
      <HeroCarousel />

      {/* ── BARRE DE RECHERCHE ── */}
      <section style={{ background: "#fff", padding: "32px 24px", borderBottom: "1px solid #f0f0f0", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <form onSubmit={handleSearch} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {/* Champ texte */}
            <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
              <Search size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un produit..."
                style={{
                  width: "100%",
                  padding: "13px 14px 13px 44px",
                  borderRadius: 12,
                  border: "1.5px solid #e5e7eb",
                  fontSize: 14,
                  color: "#111",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#1B3A2D"; }}
                onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }}
              />
            </div>

            {/* Filtre catégorie */}
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              style={{
                padding: "13px 16px",
                borderRadius: 12,
                border: "1.5px solid #e5e7eb",
                fontSize: 14,
                color: filterCat === "Toutes" ? "#9CA3AF" : "#111",
                background: "#fff",
                cursor: "pointer",
                outline: "none",
                minWidth: 160,
              }}
            >
              {allCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Filtre prix */}
            <select
              value={filterPrice}
              onChange={(e) => setFilterPrice(e.target.value)}
              style={{
                padding: "13px 16px",
                borderRadius: 12,
                border: "1.5px solid #e5e7eb",
                fontSize: 14,
                color: filterPrice === "" ? "#9CA3AF" : "#111",
                background: "#fff",
                cursor: "pointer",
                outline: "none",
                minWidth: 160,
              }}
            >
              <option value="">Tous les prix</option>
              <option value="0-50">Moins de 50€</option>
              <option value="50-150">50€ – 150€</option>
              <option value="150-500">150€ – 500€</option>
              <option value="500+">Plus de 500€</option>
            </select>

            <button
              type="submit"
              style={{
                padding: "13px 28px",
                borderRadius: 12,
                border: "none",
                background: "#1B3A2D",
                color: "white",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                whiteSpace: "nowrap",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#E07B2A"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#1B3A2D"; }}
            >
              <Search size={16} /> Rechercher
            </button>
          </form>
        </div>
      </section>

      {/* ── CATÉGORIES ── */}
      <section style={{ padding: "80px 0", background: "#ffffff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
            <SectionTitle
              label="Collections"
              title="Nos univers chasse"
              subtitle="Explorez chaque discipline, équipez-vous en expert"
            />
            <Link
              to="/categories"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                color: "#1B3A2D",
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                padding: "10px 20px",
                border: "1.5px solid #1B3A2D",
                borderRadius: 10,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1B3A2D";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#1B3A2D";
              }}
            >
              Tout voir <ArrowRight size={15} />
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 16,
            }}
          >
            {categories.map((cat) => (
              <CategoryCard key={cat.nom} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* ── MEILLEURES VENTES avec scroll horizontal mobile ── */}
      <section style={{ padding: "80px 0", background: "#F7F7F5" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
            <SectionTitle
              label="Top ventes"
              title="Les incontournables"
              subtitle="Les produits plébiscités par notre communauté de chasseurs"
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => scroll(-1)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  border: "1.5px solid #e5e7eb",
                  background: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#1B3A2D";
                  e.currentTarget.style.color = "#1B3A2D";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.color = "#374151";
                }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scroll(1)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  border: "1.5px solid #e5e7eb",
                  background: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#1B3A2D";
                  e.currentTarget.style.color = "#1B3A2D";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.color = "#374151";
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Grille desktop / scroll mobile */}
          <div
            ref={scrollRef}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 20,
            }}
            className="products-grid"
          >
            {topRated.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── BANNER PROMO ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #0a1a0f 0%, #1B3A2D 100%)",
          padding: "80px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Déco */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(224,123,42,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
            <SectionTitle
              label="Offres limitées"
              title="Promotions en cours"
              subtitle="Des remises exclusives sur une sélection premium"
              light
            />
            <Link
              to="/categories?promo=true"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                color: "#E07B2A",
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                padding: "10px 20px",
                border: "1.5px solid rgba(224,123,42,0.4)",
                borderRadius: 10,
                whiteSpace: "nowrap",
              }}
            >
              Toutes les promos <ArrowRight size={15} />
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 20,
            }}
          >
            {promos.map((p) => {
              const disc = Math.round((1 - p.prix / p.prix_barre) * 100);
              return (
                <Link
                  key={p.id}
                  to={`/produit/${p.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    padding: "20px 20px",
                    textDecoration: "none",
                    transition: "all 0.25s ease",
                    backdropFilter: "blur(4px)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.borderColor = "rgba(224,123,42,0.4)";
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* Mini image */}
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 12,
                      flexShrink: 0,
                      background: `linear-gradient(135deg, ${p.couleur_fond || "#1B3A2D"} 0%, ${p.couleur_fond || "#1B3A2D"}88 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 28,
                    }}
                  >
                    {p.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#E07B2A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                      {p.marque_nom || p.marque}
                    </p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "white", lineHeight: 1.3, marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.nom}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: "#E07B2A" }}>{Number(p.prix).toFixed(2)} €</span>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", textDecoration: "line-through" }}>{Number(p.prix_barre).toFixed(2)} €</span>
                      <span style={{ fontSize: 10, fontWeight: 700, background: "#E07B2A", color: "white", padding: "2px 6px", borderRadius: 10 }}>-{disc}%</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MARQUES ── */}
      <section style={{ padding: "70px 24px", background: "#F5F0E8" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9CA3AF", margin: 0 }}>
              Nos marques partenaires
            </p>
            <Link to="/marques" style={{ fontSize: 13, fontWeight: 700, color: "#1B3A2D", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, border: "1.5px solid #1B3A2D", padding: "6px 14px", borderRadius: 8 }}>
              Voir plus <ArrowRight size={13} />
            </Link>
          </div>
          <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8 }} className="marques-row">
            {marques.map((marque) => (
              <Link
                key={marque.id}
                to={`/marques/${encodeURIComponent(marque.nom)}`}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0, transition: "transform 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ width: 140, height: 100, borderRadius: 14, background: "white", border: "1.5px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                  {marque.logo_url ? (
                    <img src={marque.logo_url} alt={marque.nom} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                  ) : (
                    <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", color: "#1B3A2D", textAlign: "center" }}>{marque.nom.toUpperCase()}</span>
                  )}
                </div>
                <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>{marque.nom}</span>
              </Link>
            ))}
          </div>
        </div>
        <style>{`.marques-row::-webkit-scrollbar { display: none; }`}</style>
      </section>

      {/* ── AVANTAGES ── */}
      <section style={{ padding: "70px 24px", background: "white" }}>
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 24,
          }}
        >
          {[
            { icon: "🚚", title: "Livraison offerte", sub: "Dès 50€ d'achat, partout en France", color: "#1B3A2D" },
            { icon: "🔄", title: "Retour 30 jours", sub: "Satisfait ou remboursé sans condition", color: "#E07B2A" },
            { icon: "🏆", title: "SAV Expert", sub: "Conseillers chasseurs disponibles 6j/7", color: "#E07B2A" },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                background: "#FAFAFA",
                border: "1.5px solid #F0F0F0",
                borderRadius: 16,
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                transition: "all 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = item.color;
                e.currentTarget.style.boxShadow = `0 8px 24px ${item.color}15`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#F0F0F0";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span style={{ fontSize: 32 }}>{item.icon}</span>
              <p style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{item.title}</p>
              <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.5 }}>{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #E07B2A 0%, #c96a1a 100%)",
          padding: "80px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: -40, width: 240, height: 240, borderRadius: "50%", background: "rgba(0,0,0,0.06)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <Mail size={36} color="white" style={{ margin: "0 auto 16px" }} />
          <h2
            className="font-playfair"
            style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 800, color: "white", marginBottom: 10 }}
          >
            Restez informé des nouveautés
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, marginBottom: 28 }}>
            Offres exclusives, nouveautés et bons plans directement dans votre boîte mail
          </p>

          {subscribed ? (
            <div
              style={{
                background: "rgba(255,255,255,0.2)",
                borderRadius: 14,
                padding: "16px 24px",
                color: "white",
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              ✓ Merci ! Vous êtes inscrit(e) à notre newsletter.
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); if (email.trim()) { setSubscribed(true); setEmail(""); } }}
              style={{ display: "flex", gap: 10, maxWidth: 480, margin: "0 auto" }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.fr"
                required
                style={{
                  flex: 1,
                  padding: "14px 18px",
                  borderRadius: 12,
                  border: "none",
                  fontSize: 14,
                  color: "#111",
                  outline: "none",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "14px 24px",
                  borderRadius: 12,
                  border: "none",
                  background: "#1B3A2D",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#0f2318"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#1B3A2D"; }}
              >
                S'inscrire
              </button>
            </form>
          )}
        </div>
      </section>

      {/* CSS responsive inline */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
          width: max-content;
        }
        @media (max-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .products-grid {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory;
            padding-bottom: 12px;
            gap: 14px !important;
          }
          .products-grid > * {
            min-width: 240px;
            scroll-snap-align: start;
          }
          .products-grid::-webkit-scrollbar { display: none; }
        }
        @media (max-width: 480px) {
          .products-grid > * {
            min-width: 200px;
          }
        }
      `}</style>
    </div>
  );
}
