import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { useCart } from "../../context/CartContext";

const badgeConfig = {
  Nouveau: { bg: "#3B82F6" },
  Promo: { bg: "#E07B2A" },
  Bestseller: { bg: "#F59E0B" },
};

export default function ProductCard({ product }) {
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product, product.tailles[0] || "", product.couleurs[0] || "", 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleOrder = (e) => {
    e.stopPropagation();
    navigate("/commander", { state: { product } });
  };

  const handleCardClick = () => {
    navigate(`/produit/${product.id}`);
  };

  const prix = Number(product.prix) || 0;
  const prixBarre = Number(product.prix_barre || product.prixBarre) || null;
  const discount = prixBarre ? Math.round((1 - prix / prixBarre) * 100) : null;
  const marque = product.marque_nom || product.marque || "";
  const couleurFond = product.couleur_fond || product.couleurFond || "#f5f5f5";
  const imageUrl = product.image_url || product.image || null;
  const nbAvis = product.nb_avis || product.nbAvis || 0;
  const note = Number(product.note) || 0;

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid #EFEFEF",
        cursor: "pointer",
        height: "100%",
        boxShadow: hovered
          ? "0 16px 48px rgba(0,0,0,0.11)"
          : "0 2px 10px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {/* Zone image */}
      <div style={{ position: "relative", height: 240, flexShrink: 0, overflow: "hidden", background: "#f5f5f5" }}>
        {imageUrl && !imgError ? (
          <>
            <img
              src={imageUrl}
              alt={product.nom}
              onError={() => setImgError(true)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                transform: hovered ? "scale(1.07)" : "scale(1)",
                transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
                display: "block",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.15)",
                opacity: hovered ? 1 : 0,
                transition: "opacity 0.3s",
              }}
            />
          </>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: `radial-gradient(ellipse at 40% 30%, rgba(255,255,255,0.12) 0%, transparent 60%), linear-gradient(145deg, ${couleurFond} 0%, #0a0a0a 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 72,
              transform: hovered ? "scale(1.05)" : "scale(1)",
              transition: "transform 0.4s ease",
            }}
          >
            {product.emoji}
          </div>
        )}

        {/* Badges top-left */}
        <div style={{ position: "absolute", top: 12, left: 12, display: "flex", flexDirection: "column", gap: 5 }}>
          {product.badge && (
            <span
              style={{
                background: badgeConfig[product.badge].bg,
                color: "#fff",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "4px 10px",
                borderRadius: 20,
              }}
            >
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span
              style={{
                background: "#EF4444",
                color: "#fff",
                fontSize: 10,
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: 20,
              }}
            >
              -{discount}%
            </span>
          )}
        </div>

        {/* Actions top-right */}
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateX(0)" : "translateX(10px)",
            transition: "all 0.25s ease",
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
            style={{
              width: 34, height: 34, borderRadius: 9,
              background: "rgba(255,255,255,0.95)",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
            }}
          >
            <Heart size={15} fill={liked ? "#E07B2A" : "none"} color={liked ? "#E07B2A" : "#374151"} />
          </button>
          <div
            style={{
              width: 34, height: 34, borderRadius: 9,
              background: "rgba(255,255,255,0.95)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
            }}
          >
            <Eye size={15} color="#374151" />
          </div>
        </div>

        {/* Boutons hover bas */}
        <div
          style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            padding: "10px 12px",
            background: "linear-gradient(0deg, rgba(0,0,0,0.75) 0%, transparent 100%)",
            transform: hovered ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.3s ease",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <button
            onClick={handleAdd}
            style={{
              width: "100%", padding: "8px",
              borderRadius: 10, border: "none", cursor: "pointer",
              fontWeight: 700, fontSize: 12,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              background: added ? "#22C55E" : "#E07B2A",
              color: "#fff", transition: "background 0.2s",
            }}
          >
            <ShoppingCart size={14} />
            {added ? "Ajouté ✓" : "Panier"}
          </button>
          <button
            onClick={handleOrder}
            style={{
              width: "100%", padding: "8px",
              borderRadius: 10, border: "none", cursor: "pointer",
              fontWeight: 700, fontSize: 12,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              background: "#1B3A2D",
              color: "#fff", transition: "background 0.2s",
            }}
          >
            📦 Commander
          </button>
        </div>
      </div>

      {/* Infos */}
      <div style={{ padding: "14px 16px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
        <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#E07B2A", marginBottom: 5 }}>
          {marque}
        </p>
        <h3
          style={{
            fontSize: 14, fontWeight: 600, color: "#111827",
            lineHeight: 1.4, marginBottom: 8, flex: 1,
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
          }}
        >
          {product.nom}
        </h3>

        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
          <div style={{ display: "flex", gap: 2 }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={12}
                fill={s <= Math.round(note) ? "#E07B2A" : "none"}
                color={s <= Math.round(note) ? "#E07B2A" : "#D1D5DB"}
              />
            ))}
          </div>
          <span style={{ fontSize: 11, color: "#9CA3AF" }}>({nbAvis})</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 19, fontWeight: 800, color: "#1B3A2D" }}>
            {prix.toFixed(2)} €
          </span>
          {prixBarre && (
            <span style={{ fontSize: 13, color: "#9CA3AF", textDecoration: "line-through" }}>
              {prixBarre.toFixed(2)} €
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
