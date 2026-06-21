import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { SlidersHorizontal, X, ChevronRight, ChevronLeft } from "lucide-react";
import ProductCard from "../../components/ProductCard/ProductCard";
import { products } from "../../data/products";

const ITEMS_PER_PAGE = 9;
const allCategories = ["Vêtements", "Chaussures", "Chien de chasse", "Optique & Repérage", "Aménagement territoire", "Armes & Munitions"];
const allBrands = ["Browning", "Härkila", "Garmin", "Leupold", "GAMO", "Cabela's", "Beretta", "Leica"];
const allSizes = ["S", "M", "L", "XL", "XXL", "39", "40", "41", "42", "43", "44", "45"];

export default function Catalogue() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    categories: searchParams.get("categorie") ? [searchParams.get("categorie")] : [],
    brands: [],
    sizes: [],
    minPrice: "",
    maxPrice: "",
    promo: searchParams.get("promo") === "true",
  });
  const [sort, setSort] = useState("popular");
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const query = searchParams.get("q") || "";

  useEffect(() => {
    const cat = searchParams.get("categorie");
    const promo = searchParams.get("promo") === "true";
    setFilters((f) => ({ ...f, categories: cat ? [cat] : [], promo }));
    setPage(1);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (query) result = result.filter((p) => p.nom.toLowerCase().includes(query.toLowerCase()) || p.marque.toLowerCase().includes(query.toLowerCase()));
    if (filters.categories.length) result = result.filter((p) => filters.categories.includes(p.categorie));
    if (filters.brands.length) result = result.filter((p) => filters.brands.includes(p.marque));
    if (filters.sizes.length) result = result.filter((p) => p.tailles.some((s) => filters.sizes.includes(s)));
    if (filters.minPrice) result = result.filter((p) => p.prix >= Number(filters.minPrice));
    if (filters.maxPrice) result = result.filter((p) => p.prix <= Number(filters.maxPrice));
    if (filters.promo) result = result.filter((p) => p.prixBarre !== null);

    switch (sort) {
      case "price-asc": return result.sort((a, b) => a.prix - b.prix);
      case "price-desc": return result.sort((a, b) => b.prix - a.prix);
      case "new": return result.sort((a, b) => (b.badge === "Nouveau" ? 1 : 0) - (a.badge === "Nouveau" ? 1 : 0));
      default: return result.sort((a, b) => b.nbAvis - a.nbAvis);
    }
  }, [filters, sort, query]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const toggle = (key, value) => {
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({ categories: [], brands: [], sizes: [], minPrice: "", maxPrice: "", promo: false });
    setPage(1);
  };

  const Sidebar = () => (
    <aside className="w-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-gray-900">Filtres</h3>
        <button onClick={resetFilters} className="text-xs text-orange hover:underline font-medium">
          Réinitialiser
        </button>
      </div>

      {/* Catégories */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Catégorie</h4>
        <div className="space-y-2">
          {allCategories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => toggle("categories", cat)}
                className="accent-forest w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-600 group-hover:text-forest">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Prix */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Prix (€)</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => { setFilters((f) => ({ ...f, minPrice: e.target.value })); setPage(1); }}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-forest"
          />
          <span className="text-gray-400 text-xs">—</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => { setFilters((f) => ({ ...f, maxPrice: e.target.value })); setPage(1); }}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-forest"
          />
        </div>
      </div>

      {/* Marque */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Marque</h4>
        <div className="space-y-2">
          {allBrands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggle("brands", brand)}
                className="accent-forest w-4 h-4"
              />
              <span className="text-sm text-gray-600 group-hover:text-forest">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Taille */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Taille</h4>
        <div className="flex flex-wrap gap-2">
          {allSizes.map((size) => (
            <button
              key={size}
              onClick={() => toggle("sizes", size)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                filters.sizes.includes(size)
                  ? "bg-forest text-white border-forest"
                  : "border-gray-200 text-gray-600 hover:border-forest hover:text-forest"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Promo */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={filters.promo}
          onChange={() => { setFilters((f) => ({ ...f, promo: !f.promo })); setPage(1); }}
          className="accent-orange w-4 h-4"
        />
        <span className="text-sm text-gray-700 font-medium">Promotions uniquement</span>
      </label>
    </aside>
  );

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header page */}
      <div className="bg-white border-b border-gray-100 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link to="/" className="hover:text-forest">Accueil</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">Catalogue</span>
          </nav>
          <h1 className="font-playfair text-2xl font-bold text-gray-900">
            {filters.categories.length === 1 ? filters.categories[0] : "Tous les produits"}
            {query && <span className="text-orange"> — "{query}"</span>}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-20">
              <Sidebar />
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 min-w-0">
            {/* Barre de tri */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 bg-white rounded-xl shadow-sm px-4 py-3">
              <div className="flex items-center gap-3">
                <button
                  className="lg:hidden flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 px-3 py-2 rounded-lg hover:border-forest transition-colors"
                  onClick={() => setSidebarOpen(true)}
                >
                  <SlidersHorizontal size={16} />
                  Filtres
                </button>
                <span className="text-sm text-gray-500">{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Trier par :</label>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-forest"
                >
                  <option value="popular">Popularité</option>
                  <option value="new">Nouveautés</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                </select>
              </div>
            </div>

            {/* Grille */}
            {paginated.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {paginated.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl">
                <p className="text-4xl mb-4">🔍</p>
                <p className="text-gray-500 text-lg mb-4">Aucun produit ne correspond à vos critères.</p>
                <button onClick={resetFilters} className="text-orange underline font-medium text-sm">
                  Réinitialiser les filtres
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-40 hover:border-forest hover:text-forest transition-colors"
                >
                  <ChevronLeft size={16} /> Précédent
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      n === page ? "bg-forest text-white" : "border border-gray-200 text-gray-600 hover:border-forest hover:text-forest"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-40 hover:border-forest hover:text-forest transition-colors"
                >
                  Suivant <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative bg-white w-80 max-w-full h-full overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Filtres</h3>
              <button onClick={() => setSidebarOpen(false)}><X size={20} /></button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}
    </div>
  );
}
