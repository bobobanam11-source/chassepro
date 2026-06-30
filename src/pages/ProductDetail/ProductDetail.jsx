import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, ChevronRight, Truck, RefreshCw, Shield, Minus, Plus } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useData } from "../../context/DataContext";
import { api } from "../../services/api";
import ProductCard from "../../components/ProductCard/ProductCard";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useData();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTaille, setSelectedTaille] = useState("");
  const [selectedCouleur, setSelectedCouleur] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setLoading(true);
    api.get(`/produits/${id}`).then((p) => {
      setProduct(p);
      setSelectedTaille(p.tailles?.[0]?.valeurs?.[0] || "");
      setSelectedCouleur(p.couleurs?.[0] || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "#9CA3AF" }}>Chargement...</p></div>;

  if (!product) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <p style={{ fontSize: 48 }}>🔍</p>
      <p style={{ fontSize: 18, fontWeight: 600, color: "#374151" }}>Produit introuvable</p>
      <button onClick={() => navigate("/catalogue")} style={{ color: "#E07B2A", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}>Retour au catalogue</button>
    </div>
  );

  // Construire la galerie : photo principale + photos couleur active + photos supplémentaires
  const buildGallery = () => {
    const imgs = [];
    if (product.image_url) imgs.push(product.image_url);
    if (selectedCouleur?.image_url && !imgs.includes(selectedCouleur.image_url)) imgs.push(selectedCouleur.image_url);
    product.images?.forEach(img => { if (!imgs.includes(img.image_url)) imgs.push(img.image_url); });
    return imgs;
  };

  const gallery = buildGallery();
  const currentImg = gallery[activeImg] || null;
  const discount = product.prix_barre ? Math.round((1 - product.prix / product.prix_barre) * 100) : null;
  const tailles = product.tailles?.[0]?.valeurs || [];
  const similar = products.filter((p) => p.categorie_id === product.categorie_id && p.id !== product.id).slice(0, 4);

  const handleCouleur = (c) => {
    setSelectedCouleur(c);
    if (c.image_url) {
      const newGallery = buildGalleryForCouleur(c);
      const idx = newGallery.indexOf(c.image_url);
      setActiveImg(idx >= 0 ? idx : 0);
    }
  };

  const buildGalleryForCouleur = (couleur) => {
    const imgs = [];
    if (product.image_url) imgs.push(product.image_url);
    if (couleur?.image_url && !imgs.includes(couleur.image_url)) imgs.push(couleur.image_url);
    product.images?.forEach(img => { if (!imgs.includes(img.image_url)) imgs.push(img.image_url); });
    return imgs;
  };

  const handleAddToCart = () => {
    addToCart({ ...product, taille: selectedTaille, couleur: selectedCouleur?.nom || "" }, selectedTaille, selectedCouleur?.nom || "", quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", background: "#f9fafb" }}>
      {/* Fil d'ariane */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px" }}>
        <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#9CA3AF" }}>
          <Link to="/" style={{ color: "#9CA3AF", textDecoration: "none" }}>Accueil</Link>
          <ChevronRight size={14} />
          <Link to="/catalogue" style={{ color: "#9CA3AF", textDecoration: "none" }}>Catalogue</Link>
          <ChevronRight size={14} />
          <span style={{ color: "#111", fontWeight: 500 }}>{product.nom}</span>
        </nav>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 60px" }}>
        <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 20px rgba(0,0,0,0.06)", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }} className="product-grid">

            {/* Galerie */}
            <div style={{ padding: 32 }}>
              {/* Image principale */}
              <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 12, height: 380, background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {currentImg ? (
                  <img src={currentImg} alt={product.nom} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: 80 }}>📦</span>
                )}
              </div>

              {/* Miniatures */}
              {gallery.length > 1 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {gallery.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)} style={{ width: 72, height: 72, borderRadius: 10, overflow: "hidden", border: activeImg === i ? "2px solid #1B3A2D" : "2px solid transparent", cursor: "pointer", padding: 0, background: "#f5f5f5" }}>
                      <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Infos */}
            <div style={{ padding: 32, borderLeft: "1px solid #f0f0f0" }}>
              {product.marque_nom && (
                <p style={{ fontSize: 11, fontWeight: 700, color: "#E07B2A", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8 }}>{product.marque_nom}</p>
              )}
              <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(20px,3vw,28px)", fontWeight: 800, color: "#111", marginBottom: 12, lineHeight: 1.3 }}>{product.nom}</h1>

              {/* Note */}
              {product.note > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <div style={{ display: "flex", gap: 2 }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={15} fill={s <= Math.round(product.note) ? "#E07B2A" : "none"} color={s <= Math.round(product.note) ? "#E07B2A" : "#d1d5db"} />)}
                  </div>
                  <span style={{ fontSize: 13, color: "#E07B2A", fontWeight: 600 }}>{product.note}</span>
                  {product.nb_avis > 0 && <span style={{ fontSize: 13, color: "#9CA3AF" }}>({product.nb_avis} avis)</span>}
                </div>
              )}

              {/* Prix */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 24 }}>
                <span style={{ fontSize: 32, fontWeight: 900, color: "#E07B2A" }}>{Number(product.prix).toFixed(2)} €</span>
                {product.prix_barre && (
                  <>
                    <span style={{ fontSize: 18, color: "#9CA3AF", textDecoration: "line-through" }}>{Number(product.prix_barre).toFixed(2)} €</span>
                    <span style={{ background: "#FEE2E2", color: "#DC2626", fontSize: 12, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>-{discount}%</span>
                  </>
                )}
              </div>

              {/* Tailles */}
              {tailles.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8 }}>Taille : <span style={{ color: "#1B3A2D" }}>{selectedTaille}</span></p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {tailles.map((t) => (
                      <button key={t} onClick={() => setSelectedTaille(t)} style={{ padding: "8px 16px", borderRadius: 10, border: selectedTaille === t ? "2px solid #1B3A2D" : "1.5px solid #e5e7eb", background: selectedTaille === t ? "#1B3A2D" : "#fff", color: selectedTaille === t ? "#fff" : "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Couleurs */}
              {product.couleurs?.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8 }}>Couleur : <span style={{ color: "#1B3A2D" }}>{selectedCouleur?.nom || ""}</span></p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {product.couleurs.map((c) => (
                      <button key={c.id} onClick={() => handleCouleur(c)} title={c.nom} style={{ width: 32, height: 32, borderRadius: "50%", background: c.code_hex, border: selectedCouleur?.id === c.id ? "3px solid #111" : "2px solid #e5e7eb", cursor: "pointer", transition: "transform 0.15s", transform: selectedCouleur?.id === c.id ? "scale(1.15)" : "scale(1)" }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantité */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8 }}>Quantité</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: 36, height: 36, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Minus size={15} /></button>
                  <span style={{ fontSize: 18, fontWeight: 700, minWidth: 32, textAlign: "center" }}>{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} style={{ width: 36, height: 36, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={15} /></button>
                </div>
              </div>

              {/* CTA */}
              <button onClick={handleAddToCart} style={{ width: "100%", padding: "15px", borderRadius: 14, border: "none", background: added ? "#22C55E" : "#E07B2A", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16, transition: "background 0.2s" }}>
                <ShoppingCart size={18} />
                {added ? "Ajouté au panier ✓" : "Ajouter au panier"}
              </button>

              {/* Avantages */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
                {[{ icon: Truck, label: "Livraison offerte", sub: "dès 50€" }, { icon: RefreshCw, label: "Retour gratuit", sub: "30 jours" }, { icon: Shield, label: "Garantie", sub: "2 ans" }].map(({ icon: Icon, label, sub }) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <Icon size={18} color="#1B3A2D" style={{ margin: "0 auto 4px" }} />
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#374151", margin: 0 }}>{label}</p>
                    <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>{sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 2px 20px rgba(0,0,0,0.06)", marginTop: 20 }}>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 20, fontWeight: 800, color: "#111", marginBottom: 12 }}>Description</h2>
            <p style={{ color: "#4B5563", lineHeight: 1.8, fontSize: 14 }}>{product.description}</p>
          </div>
        )}

        {/* Produits similaires */}
        {similar.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 22, fontWeight: 800, color: "#111", marginBottom: 20 }}>Produits similaires</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
              {similar.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
