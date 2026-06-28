import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Catalogue from "./pages/Catalogue/Catalogue";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Cart from "./pages/Cart/Cart";
import Contact from "./pages/Contact/Contact";
import Checkout from "./pages/Checkout/Checkout";

function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/33757754353"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        width: 58,
        height: 58,
        borderRadius: "50%",
        background: "#25D366",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 20px rgba(37,211,102,0.5)",
        cursor: "pointer",
        transition: "transform 0.2s",
      }}
      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        <line x1="9" y1="10" x2="9" y2="10" strokeWidth="3" strokeLinecap="round"/>
        <line x1="12" y1="10" x2="12" y2="10" strokeWidth="3" strokeLinecap="round"/>
        <line x1="15" y1="10" x2="15" y2="10" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    </a>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <WhatsAppButton />
          <main className="flex-1">
            <Routes>
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
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}
