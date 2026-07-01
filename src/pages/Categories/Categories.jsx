import { useParams, Link, useSearchParams } from "react-router-dom";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { useData } from "../../context/DataContext";
import ProductCard from "../../components/ProductCard/ProductCard";
import CategoryCard from "../../components/CategoryCard/CategoryCard";

export default function Categories() {
  const { nom } = useParams();
  const [searchParams] = useSearchParams();
  const { products, categories } = useData();

  // Vue promotions
  if (!nom && searchParams.get("promo") === "true") {
    const promos = products.filter((p) => p.prix_barre && Number(p.prix_barre) > 0);
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100 py-6 px-4">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Link to="/" className="hover:text-forest">Accueil</Link>
              <ChevronRight size={14} />
              <span className="text-gray-900 font-medium">Promotions</span>
            </nav>
            <h1 className="font-playfair text-2xl font-bold text-gray-900">🏷️ Promotions en cours</h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {promos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {promos.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl">
              <p className="text-4xl mb-4">🏷️</p>
              <p className="text-gray-500 text-lg">Aucune promotion en cours.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Vue liste des catégories
  if (!nom) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100 py-6 px-4">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Link to="/" className="hover:text-forest">Accueil</Link>
              <ChevronRight size={14} />
              <span className="text-gray-900 font-medium">Catégories</span>
            </nav>
            <h1 className="font-playfair text-2xl font-bold text-gray-900">Nos catégories</h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Vue produits d'une catégorie
  const catNom = decodeURIComponent(nom);
  const produits = products.filter((p) => p.categorie_nom === catNom);
  const categorie = categories.find((c) => c.nom === catNom);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link to="/" className="hover:text-forest">Accueil</Link>
            <ChevronRight size={14} />
            <Link to="/categories" className="hover:text-forest">Catégories</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">{catNom}</span>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {categorie?.emoji && <span style={{ fontSize: 32 }}>{categorie.emoji}</span>}
            <h1 className="font-playfair text-2xl font-bold text-gray-900">{catNom}</h1>
            <span style={{ fontSize: 13, color: "#9CA3AF" }}>{produits.length} produit{produits.length > 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/categories" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#1B3A2D", fontWeight: 600, marginBottom: 24, textDecoration: "none" }}>
          <ArrowLeft size={15} /> Toutes les catégories
        </Link>
        {produits.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {produits.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl">
            <p className="text-4xl mb-4">📦</p>
            <p className="text-gray-500 text-lg">Aucun produit dans cette catégorie.</p>
          </div>
        )}
      </div>
    </div>
  );
}
