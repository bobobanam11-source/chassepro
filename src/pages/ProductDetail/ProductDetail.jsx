import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, Heart, ShoppingCart, ChevronRight, Truck, RefreshCw, Shield, Minus, Plus } from "lucide-react";
import { products } from "../../data/products";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useCart } from "../../context/CartContext";

const thumbnailColors = ["#1B3A2D", "#2d5a40", "#0f2318", "#3a4a2d"];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === Number(id));
  const { addToCart } = useCart();

  const [selectedTaille, setSelectedTaille] = useState(product?.tailles[0] || "");
  const [selectedCouleur, setSelectedCouleur] = useState(product?.couleurs[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [added, setAdded] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);

  if (!product) {
    return (
      <div className="pt-28 min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500">
        <p className="text-5xl">🔍</p>
        <p className="text-xl font-semibold">Produit introuvable</p>
        <button onClick={() => navigate("/catalogue")} className="text-orange underline text-sm">
          Retour au catalogue
        </button>
      </div>
    );
  }

  const similar = products.filter((p) => p.categorie === product.categorie && p.id !== product.id).slice(0, 4);
  const discount = product.prixBarre ? Math.round((1 - product.prix / product.prixBarre) * 100) : null;

  const handleAddToCart = () => {
    addToCart(product, selectedTaille, selectedCouleur, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Fil d'ariane */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-forest">Accueil</Link>
          <ChevronRight size={14} />
          <Link to="/catalogue" className="hover:text-forest">Catalogue</Link>
          <ChevronRight size={14} />
          <Link to={`/catalogue?categorie=${encodeURIComponent(product.categorie)}`} className="hover:text-forest">
            {product.categorie}
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 truncate max-w-xs">{product.nom}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Layout 2 colonnes */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Colonne gauche : images */}
            <div className="p-6 lg:p-8">
              {/* Image principale */}
              <div
                className="rounded-xl overflow-hidden mb-4"
                style={{ height: 380 }}
              >
                <div
                  style={{
                    background: `linear-gradient(135deg, ${thumbnailColors[activeThumb]} 0%, ${product.couleurFond} 100%)`,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 16,
                  }}
                >
                  <span style={{ fontSize: 100 }}>{product.emoji}</span>
                  <span style={{ color: "#F5F0E8", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em" }}>
                    {product.marque.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Miniatures */}
              <div className="grid grid-cols-4 gap-3">
                {thumbnailColors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveThumb(i)}
                    className={`rounded-lg overflow-hidden border-2 transition-all ${
                      activeThumb === i ? "border-forest" : "border-transparent hover:border-gray-200"
                    }`}
                    style={{ height: 72 }}
                  >
                    <div
                      style={{
                        background: `linear-gradient(135deg, ${color} 0%, ${color}99 100%)`,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 24,
                      }}
                    >
                      {product.emoji}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Colonne droite : infos */}
            <div className="p-6 lg:p-8 lg:border-l border-gray-100">
              <Link
                to={`/catalogue?marque=${product.marque}`}
                className="text-xs font-bold text-orange uppercase tracking-widest hover:underline"
              >
                {product.marque}
              </Link>
              <h1 className="font-playfair text-2xl lg:text-3xl font-bold text-gray-900 mt-2 mb-3 leading-tight">
                {product.nom}
              </h1>

              {/* Note */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={16}
                      fill={s <= Math.round(product.note) ? "#E07B2A" : "none"}
                      color={s <= Math.round(product.note) ? "#E07B2A" : "#d1d5db"}
                    />
                  ))}
                </div>
                <span className="text-orange font-semibold text-sm">{product.note}</span>
                <span className="text-gray-400 text-sm">({product.nbAvis} avis)</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${product.stock > 5 ? "bg-green-100 text-green-700" : "bg-orange/10 text-orange"}`}>
                  {product.stock > 5 ? "En stock" : `Plus que ${product.stock}`}
                </span>
              </div>

              {/* Prix */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-orange">{product.prix.toFixed(2)} €</span>
                {product.prixBarre && (
                  <>
                    <span className="text-gray-400 line-through text-lg">{product.prixBarre.toFixed(2)} €</span>
                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">-{discount}%</span>
                  </>
                )}
              </div>

              {/* Tailles */}
              {product.tailles.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Taille : <span className="text-forest">{selectedTaille}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.tailles.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTaille(t)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                          selectedTaille === t
                            ? "bg-forest text-white border-forest"
                            : "border-gray-200 text-gray-600 hover:border-forest hover:text-forest"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Couleurs */}
              {product.couleurs.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Couleur</p>
                  <div className="flex gap-3">
                    {product.couleurs.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedCouleur(c)}
                        style={{ backgroundColor: c }}
                        className={`w-8 h-8 rounded-full border-4 transition-all ${
                          selectedCouleur === c ? "border-gray-900 scale-110" : "border-transparent hover:border-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantité */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">Quantité</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:border-forest hover:text-forest transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:border-forest hover:text-forest transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* CTA */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    added ? "bg-green-500 text-white" : "bg-orange hover:bg-orange-dark text-white shadow-lg hover:shadow-orange/30"
                  }`}
                >
                  <ShoppingCart size={18} />
                  {added ? "Ajouté au panier ✓" : "Ajouter au panier"}
                </button>
                <button
                  onClick={() => setLiked(!liked)}
                  className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all ${
                    liked ? "border-orange bg-orange/10 text-orange" : "border-gray-200 text-gray-400 hover:border-orange hover:text-orange"
                  }`}
                >
                  <Heart size={20} fill={liked ? "#E07B2A" : "none"} />
                </button>
              </div>

              {/* Avantages */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                {[
                  { icon: Truck, label: "Livraison offerte", sub: "dès 50€" },
                  { icon: RefreshCw, label: "Retour gratuit", sub: "30 jours" },
                  { icon: Shield, label: "Garantie", sub: "2 ans" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="text-center">
                    <Icon size={20} className="text-forest mx-auto mb-1" />
                    <p className="text-xs font-medium text-gray-700">{label}</p>
                    <p className="text-xs text-gray-400">{sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="bg-white rounded-2xl shadow-sm mt-6 overflow-hidden">
          <div className="flex border-b border-gray-100">
            {["description", "caractéristiques", "avis"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-forest text-forest"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab === "avis" ? `Avis (${product.nbAvis})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="p-6 lg:p-8">
            {activeTab === "description" && (
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            )}
            {activeTab === "caractéristiques" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(product.caracteristiques).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                    <span className="text-sm font-semibold text-gray-700">{k}</span>
                    <span className="text-sm text-gray-600">{v}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "avis" && (
              <div className="space-y-4">
                {[
                  { nom: "Pierre M.", note: 5, date: "12 mars 2025", text: "Excellent produit, je le recommande vivement. Qualité au rendez-vous." },
                  { nom: "Sophie L.", note: 4, date: "3 mars 2025", text: "Très bon rapport qualité/prix. Taille conforme, livraison rapide." },
                  { nom: "Jean-Claude B.", note: 5, date: "15 fév. 2025", text: "Parfait pour la chasse à l'approche. Très solide, imperméable comme annoncé." },
                ].map((avis, i) => (
                  <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-forest text-cream rounded-full flex items-center justify-center text-xs font-bold">
                          {avis.nom.charAt(0)}
                        </div>
                        <span className="font-semibold text-sm">{avis.nom}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1,2,3,4,5].map((s) => (
                            <Star key={s} size={12} fill={s <= avis.note ? "#E07B2A" : "none"} color={s <= avis.note ? "#E07B2A" : "#d1d5db"} />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">{avis.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{avis.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Produits similaires */}
        {similar.length > 0 && (
          <div className="mt-12">
            <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-6">Produits similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {similar.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
