import { useParams, Link } from "react-router-dom";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { useData } from "../../context/DataContext";
import ProductCard from "../../components/ProductCard/ProductCard";

export default function Marques() {
  const { nom } = useParams();
  const { products, marques } = useData();

  // Vue liste des marques
  if (!nom) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100 py-6 px-4">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Link to="/" className="hover:text-forest">Accueil</Link>
              <ChevronRight size={14} />
              <span className="text-gray-900 font-medium">Marques</span>
            </nav>
            <h1 className="font-playfair text-2xl font-bold text-gray-900">Nos marques</h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
            {marques.map((marque) => (
              <Link
                key={marque.id}
                to={`/marques/${encodeURIComponent(marque.nom)}`}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textDecoration: "none", transition: "transform 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ width: 160, height: 110, borderRadius: 14, background: "white", border: "1.5px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                  {marque.logo_url ? (
                    <img src={marque.logo_url} alt={marque.nom} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                  ) : (
                    <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", color: "#1B3A2D", textAlign: "center" }}>{marque.nom.toUpperCase()}</span>
                  )}
                </div>
                <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>{marque.nom}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Vue produits d'une marque
  const marqueNom = decodeURIComponent(nom);
  const produits = products.filter((p) => p.marque_nom === marqueNom);
  const marque = marques.find((m) => m.nom === marqueNom);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link to="/" className="hover:text-forest">Accueil</Link>
            <ChevronRight size={14} />
            <Link to="/marques" className="hover:text-forest">Marques</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">{marqueNom}</span>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {marque?.logo_url && (
              <img src={marque.logo_url} alt={marqueNom} style={{ height: 48, objectFit: "contain" }} />
            )}
            <div>
              <h1 className="font-playfair text-2xl font-bold text-gray-900">{marqueNom}</h1>
              <span style={{ fontSize: 13, color: "#9CA3AF" }}>{produits.length} produit{produits.length > 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/marques" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#1B3A2D", fontWeight: 600, marginBottom: 24, textDecoration: "none" }}>
          <ArrowLeft size={15} /> Toutes les marques
        </Link>
        {produits.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {produits.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl">
            <p className="text-4xl mb-4">📦</p>
            <p className="text-gray-500 text-lg">Aucun produit pour cette marque.</p>
          </div>
        )}
      </div>
    </div>
  );
}
