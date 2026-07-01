import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CategoryCard({ category }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      to={`/categories/${encodeURIComponent(category.nom)}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        borderRadius: 18,
        overflow: "hidden",
        textDecoration: "none",
        position: "relative",
        height: 180,
        transform: hovered ? "translateY(-5px) scale(1.01)" : "translateY(0) scale(1)",
        boxShadow: hovered
          ? "0 20px 44px rgba(0,0,0,0.2)"
          : "0 4px 14px rgba(0,0,0,0.08)",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        cursor: "pointer",
      }}
    >
      {/* Image de fond */}
      {category.photo_url && !imgError ? (
        <img
          src={category.photo_url}
          alt={category.nom}
          onError={() => setImgError(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            transform: hovered ? "scale(1.1)" : "scale(1)",
            transition: "transform 0.5s ease",
          }}
        />
      ) : (
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1B3A2D 0%, #0a1a0f 100%)" }} />
      )}

      {/* Overlay dégradé sombre */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(0deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.1) 100%)",
          transition: "background 0.3s",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1B3A2D22 0%, #00000066 100%)", opacity: 0.35 }} />

      {/* Contenu */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "16px 18px",
        }}
      >
        {/* Emoji */}
        <span
          style={{
            fontSize: 30,
            marginBottom: 6,
            filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))",
            transform: hovered ? "scale(1.15)" : "scale(1)",
            transition: "transform 0.3s ease",
            display: "block",
          }}
        >
          {category.emoji}
        </span>
        <p
          style={{
            color: "white",
            fontWeight: 700,
            fontSize: 14,
            marginBottom: 2,
            textShadow: "0 1px 4px rgba(0,0,0,0.6)",
          }}
        >
          {category.nom}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>
            {category.count} produits
          </p>
          <div
            style={{
              width: 26, height: 26, borderRadius: 8,
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(4px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: hovered ? 1 : 0,
              transform: hovered ? "translateX(0)" : "translateX(6px)",
              transition: "all 0.25s ease",
            }}
          >
            <ArrowRight size={13} color="white" />
          </div>
        </div>
      </div>
    </Link>
  );
}
