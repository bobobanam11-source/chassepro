import { useState, useEffect } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { Search, User, ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "../../context/CartContext";

const navLinks = [
  { to: "/", label: "Accueil", exact: true },
  { to: "/categories", label: "Catégories", exact: false },
  { to: "/categories?promo=true", label: "Promotions", exact: false, promo: true },
  { to: "/contact", label: "Contact", exact: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";
  const transparent = isHome && !scrolled;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogue?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const isActive = (link) => {
    if (link.to === "/") return location.pathname === "/";
    return location.pathname.startsWith(link.to.split("?")[0]);
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 100,
          height: 68,
          background: transparent ? "transparent" : "rgba(255,255,255,0.97)",
          boxShadow: transparent ? "none" : "0 1px 0 rgba(0,0,0,0.07), 0 4px 20px rgba(0,0,0,0.06)",
          backdropFilter: transparent ? "none" : "blur(14px)",
          transition: "background 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          {/* ── Logo ── */}
          <Link
            to="/"
            style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}
          >
            <div
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: "#1B3A2D",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 17, flexShrink: 0,
              }}
            >
              🎯
            </div>
            <span
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: 19, fontWeight: 800,
                color: transparent ? "white" : "#1B3A2D",
                letterSpacing: "-0.02em",
                transition: "color 0.3s",
              }}
            >
              Garminchasse
            </span>
          </Link>

          {/* ── Liens desktop ── */}
          <div
            id="nav-links"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {navLinks.map((link) => {
              const active = isActive(link);
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  style={{
                    textDecoration: "none",
                    position: "relative",
                    padding: "8px 15px",
                    borderRadius: 9,
                    fontSize: 14,
                    fontWeight: active ? 700 : 500,
                    color: link.promo
                      ? "#E07B2A"
                      : active
                        ? (transparent ? "white" : "#1B3A2D")
                        : (transparent ? "rgba(255,255,255,0.8)" : "#4B5563"),
                    background: active && !transparent ? "rgba(27,58,45,0.08)" : "transparent",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = transparent ? "white" : "#1B3A2D";
                      e.currentTarget.style.background = transparent ? "rgba(255,255,255,0.1)" : "rgba(27,58,45,0.06)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = link.promo
                        ? "#E07B2A"
                        : transparent ? "rgba(255,255,255,0.8)" : "#4B5563";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {link.label}
                  {/* Indicateur actif */}
                  <span
                    style={{
                      position: "absolute",
                      bottom: 2,
                      left: "50%",
                      transform: "translateX(-50%)",
                      height: 2,
                      width: active ? "60%" : "0%",
                      borderRadius: 2,
                      background: link.promo ? "#E07B2A" : (transparent ? "white" : "#E07B2A"),
                      transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
                    }}
                  />
                </Link>
              );
            })}
          </div>

          {/* ── Actions droite ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {/* Recherche */}
            {searchOpen ? (
              <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  style={{
                    border: `1.5px solid #1B3A2D`,
                    borderRadius: 9,
                    padding: "7px 13px",
                    fontSize: 13,
                    width: 200,
                    outline: "none",
                    background: "white",
                    color: "#111",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  style={{
                    width: 32, height: 32, borderRadius: 8, border: "none",
                    background: "rgba(0,0,0,0.07)", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <X size={15} />
                </button>
              </form>
            ) : (
              <IconBtn transparent={transparent} onClick={() => setSearchOpen(true)}>
                <Search size={18} />
              </IconBtn>
            )}

            <IconBtn transparent={transparent} className="hide-mobile">
              <User size={18} />
            </IconBtn>

            {/* Panier */}
            <Link
              to="/panier"
              style={{
                position: "relative",
                width: 38, height: 38, borderRadius: 10,
                background: count > 0 ? "#1B3A2D" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: count > 0 ? "white" : (transparent ? "white" : "#374151"),
                textDecoration: "none",
                transition: "all 0.2s",
                border: "none",
              }}
              onMouseEnter={(e) => { if (!count) e.currentTarget.style.background = transparent ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)"; }}
              onMouseLeave={(e) => { if (!count) e.currentTarget.style.background = "transparent"; }}
            >
              <ShoppingCart size={18} />
              {count > 0 && (
                <span
                  style={{
                    position: "absolute", top: -5, right: -5,
                    background: "#E07B2A", color: "white",
                    fontSize: 10, fontWeight: 800,
                    borderRadius: 10, minWidth: 18, height: 18,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "0 4px", border: "2px solid white",
                    lineHeight: 1,
                  }}
                >
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>

            {/* Burger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="show-mobile"
              style={{
                width: 38, height: 38, borderRadius: 10,
                border: "none",
                background: menuOpen
                  ? "rgba(27,58,45,0.1)"
                  : transparent ? "rgba(255,255,255,0.1)" : "transparent",
                cursor: "pointer", display: "none",
                alignItems: "center", justifyContent: "center",
                color: transparent ? "white" : "#374151",
                transition: "all 0.2s",
              }}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Menu mobile ── */}
      <div
        style={{
          position: "fixed",
          top: 68, left: 0, right: 0,
          background: "white",
          zIndex: 99,
          borderBottom: "1px solid #F0F0F0",
          boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
          padding: menuOpen ? "12px 20px 20px" : "0 20px",
          maxHeight: menuOpen ? 400 : 0,
          overflow: "hidden",
          transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1), padding 0.35s ease",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 12 }}>
          {navLinks.map((link) => {
            const active = isActive(link);
            return (
              <Link
                key={link.label}
                to={link.to}
                style={{
                  textDecoration: "none",
                  padding: "11px 14px",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: active ? 700 : 500,
                  color: link.promo ? "#E07B2A" : active ? "#1B3A2D" : "#374151",
                  background: active ? "rgba(27,58,45,0.07)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderLeft: active ? "3px solid #E07B2A" : "3px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                {link.label}
                {active && (
                  <span
                    style={{
                      width: 6, height: 6, borderRadius: 3,
                      background: "#E07B2A",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>
        <Link
          to="/panier"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 8, padding: "13px",
            borderRadius: 12, background: "#1B3A2D",
            color: "white", textDecoration: "none",
            fontWeight: 700, fontSize: 14,
          }}
        >
          <ShoppingCart size={16} />
          Mon panier {count > 0 && `(${count})`}
        </Link>
      </div>

      <style>{`
        @media (max-width: 840px) {
          #nav-links { display: none !important; }
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
          nav { background: rgba(13,31,15,0.95) !important; backdrop-filter: blur(14px) !important; }
          nav span[style*="Garminchasse"], nav a span { color: white !important; }
        }
      `}</style>
    </>
  );
}

function IconBtn({ children, transparent, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={className}
      style={{
        width: 38, height: 38, borderRadius: 10,
        border: "none", background: "transparent",
        cursor: "pointer", display: "flex",
        alignItems: "center", justifyContent: "center",
        color: transparent ? "white" : "#374151",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = transparent ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      {children}
    </button>
  );
}
