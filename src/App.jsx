import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { SettingsProvider, useSettings } from "./context/SettingsContext";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Catalogue from "./pages/Catalogue/Catalogue";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Cart from "./pages/Cart/Cart";
import Contact from "./pages/Contact/Contact";
import Checkout from "./pages/Checkout/Checkout";
import SiteOff from "./pages/SiteOff/SiteOff";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminProduits from "./admin/pages/AdminProduits";
import AdminCategories from "./admin/pages/AdminCategories";
import AdminMarques from "./admin/pages/AdminMarques";
import AdminCarousel from "./admin/pages/AdminCarousel";
import AdminCommandes from "./admin/pages/AdminCommandes";
import AdminParametres from "./admin/pages/AdminParametres";
import AdminGuide from "./admin/pages/AdminGuide";

function ChatBoard() {
  const { settings } = useSettings();
  const number = settings?.whatsapp_number || "33757754353";

  const handleClick = async () => {
    try { await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000/api"}/stats/chatboard`, { method: "POST" }); } catch {}
    window.open(`https://wa.me/${number}`, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 9999,
        width: 58, height: 58, borderRadius: "50%",
        background: "#25D366", border: "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 20px rgba(37,211,102,0.5)",
        cursor: "pointer", transition: "transform 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      title="Nous contacter sur WhatsApp"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <line x1="9" y1="10" x2="9" y2="10" strokeWidth="3" strokeLinecap="round" />
        <line x1="12" y1="10" x2="12" y2="10" strokeWidth="3" strokeLinecap="round" />
        <line x1="15" y1="10" x2="15" y2="10" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </button>
  );
}

function SiteLayout() {
  const { settings, loading } = useSettings();
  if (loading) return null;
  if (settings?.site_actif === "false") return <SiteOff />;
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <ChatBoard />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="produits" element={<AdminProduits />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="marques" element={<AdminMarques />} />
              <Route path="carousel" element={<AdminCarousel />} />
              <Route path="commandes" element={<AdminCommandes />} />
              <Route path="parametres" element={<AdminParametres />} />
              <Route path="guide" element={<AdminGuide />} />
            </Route>

            {/* Site public */}
            <Route element={<SiteLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/catalogue" element={<Catalogue />} />
              <Route path="/produit/:id" element={<ProductDetail />} />
              <Route path="/panier" element={<Cart />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/commander" element={<Checkout />} />
              <Route path="*" element={
                <div className="pt-28 flex flex-col items-center justify-center min-h-screen gap-4">
                  <p className="text-6xl">🦌</p>
                  <h1 className="font-playfair text-3xl font-bold text-gray-900">Page introuvable</h1>
                  <a href="/" className="text-orange underline font-medium">Retour à l'accueil</a>
                </div>
              } />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </SettingsProvider>
  );
}
