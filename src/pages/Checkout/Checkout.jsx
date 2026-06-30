import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import { useCart } from "../../context/CartContext";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product || null;
  const { settings } = useSettings();
  const { items, total, clearCart } = useCart ? useCart() : { items: [], total: 0, clearCart: () => {} };
  const [done, setDone] = useState(false);

  const handleCommander = () => {
    const number = settings?.whatsapp_number || "33757754353";

    const produits = product
      ? [{ nom: product.nom, prix: product.prix, taille: product.taille || "", couleur: product.couleur || "", quantite: product.quantite || 1 }]
      : items.map((i) => ({ nom: i.nom, prix: i.prix, taille: i.taille || "", couleur: i.couleur || "", quantite: i.quantite }));

    const lignes = produits.map((p) =>
      `🛍️ *${p.nom}*\n💰 Prix : ${p.prix} €${p.taille ? `\n📏 Taille : ${p.taille}` : ""}${p.couleur ? `\n🎨 Couleur : ${p.couleur}` : ""}\n🔢 Quantité : ${p.quantite}`
    ).join("\n\n");

    const totalPrix = product ? product.prix * (product.quantite || 1) : total;
    const message = `Bonjour, je souhaite commander :\n\n${lignes}\n\n💵 *Total : ${Number(totalPrix).toFixed(2)} €*\n\nMerci !`;

    try {
      fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000/api"}/commandes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          produit_id: product?.id || null,
          nom_produit: produits.map((p) => p.nom).join(", "),
          prix: totalPrix,
          quantite: produits.reduce((acc, p) => acc + p.quantite, 0),
        }),
      });
    } catch {}

    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank");
    clearCart?.();
    setDone(true);
  };

  if (done) {
    return (
      <div style={{ minHeight: "100vh", background: "#F7F7F5", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "56px 48px", textAlign: "center", maxWidth: 480, boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
          <CheckCircle size={64} color="#1B3A2D" style={{ margin: "0 auto 20px" }} />
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 12 }}>
            Commande envoyée !
          </h2>
          <p style={{ color: "#6B7280", fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
            Votre commande a été envoyée sur WhatsApp. Nous vous contacterons rapidement pour confirmer la livraison.
          </p>
          <button
            onClick={() => navigate("/")}
            style={{ padding: "13px 32px", borderRadius: 12, border: "none", background: "#1B3A2D", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const produits = product
    ? [{ nom: product.nom, prix: product.prix, taille: product.taille || "", couleur: product.couleur || "", quantite: product.quantite || 1 }]
    : items.map((i) => ({ nom: i.nom, prix: i.prix, taille: i.taille || "", couleur: i.couleur || "", quantite: i.quantite }));

  const totalPrix = product ? product.prix * (product.quantite || 1) : total;

  if (!produits.length) {
    return (
      <div style={{ minHeight: "100vh", background: "#F7F7F5", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>🛒</p>
          <p style={{ fontSize: 16, color: "#6B7280", marginBottom: 24 }}>Votre panier est vide</p>
          <button onClick={() => navigate("/catalogue")} style={{ padding: "13px 32px", borderRadius: 12, border: "none", background: "#1B3A2D", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            Voir le catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F5", paddingTop: 100, paddingBottom: 60 }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ width: 28, height: 3, borderRadius: 2, background: "#E07B2A", display: "inline-block" }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#E07B2A" }}>Commande</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(24px,4vw,36px)", fontWeight: 800, color: "#111827" }}>
            Récapitulatif
          </h1>
        </div>

        {/* Liste produits */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 16px rgba(0,0,0,0.05)", marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#1B3A2D", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
            🛒 Votre commande
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {produits.map((p, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: i < produits.length - 1 ? 16 : 0, borderBottom: i < produits.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#111", marginBottom: 4 }}>{p.nom}</p>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {p.taille && <span style={{ fontSize: 12, color: "#6B7280" }}>📏 {p.taille}</span>}
                    {p.couleur && <span style={{ fontSize: 12, color: "#6B7280" }}>🎨 {p.couleur}</span>}
                    <span style={{ fontSize: 12, color: "#6B7280" }}>🔢 Qté : {p.quantite}</span>
                  </div>
                </div>
                <p style={{ fontSize: 15, fontWeight: 800, color: "#E07B2A", marginLeft: 16, whiteSpace: "nowrap" }}>
                  {(p.prix * p.quantite).toFixed(2)} €
                </p>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "2px solid #f0f0f0", marginTop: 16, paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>Total</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#1B3A2D" }}>{Number(totalPrix).toFixed(2)} €</span>
          </div>
        </div>

        {/* Infos */}
        <div style={{ background: "#F0FDF4", borderRadius: 12, padding: "14px 18px", marginBottom: 24, border: "1px solid #BBF7D0" }}>
          <p style={{ fontSize: 13, color: "#166534", fontWeight: 600, margin: 0 }}>
            💬 En cliquant sur "Commander via WhatsApp", votre commande sera envoyée directement sur WhatsApp. Nous vous contacterons pour confirmer la livraison et le paiement.
          </p>
        </div>

        <button
          onClick={handleCommander}
          style={{
            width: "100%", padding: "16px", borderRadius: 14, border: "none",
            background: "linear-gradient(135deg, #25D366 0%, #1aaa4f 100%)",
            color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer",
            boxShadow: "0 6px 20px rgba(37,211,102,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Commander via WhatsApp
        </button>
      </div>
    </div>
  );
}
