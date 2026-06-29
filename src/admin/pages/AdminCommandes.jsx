import { useEffect, useState } from "react";
import { api } from "../../services/api";

const STATUTS = ["en_attente", "confirmee", "expediee", "livree", "annulee"];
const LABELS = { en_attente: "⏳ En attente", confirmee: "✅ Confirmée", expediee: "🚚 Expédiée", livree: "📦 Livrée", annulee: "❌ Annulée" };
const COLORS = { en_attente: "#F59E0B", confirmee: "#22C55E", expediee: "#3B82F6", livree: "#1B3A2D", annulee: "#EF4444" };

export default function AdminCommandes() {
  const [commandes, setCommandes] = useState([]);

  const load = () => api.get("/commandes").then(setCommandes);
  useEffect(() => { load(); }, []);

  const changeStatut = async (id, statut) => {
    await api.put(`/commandes/${id}`, { statut });
    load();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 26, fontWeight: 800, color: "#111", margin: 0 }}>
        Commandes <span style={{ fontSize: 16, color: "#9CA3AF", fontWeight: 400 }}>({commandes.length})</span>
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {commandes.map((c) => (
          <div key={c.id} style={{ background: "#fff", borderRadius: 14, padding: "16px 20px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, color: "#111", margin: 0 }}>{c.nom_produit}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                  {c.taille && <span style={{ fontSize: 12, background: "#F3F4F6", borderRadius: 6, padding: "2px 8px" }}>Taille : {c.taille}</span>}
                  {c.couleur && <span style={{ fontSize: 12, background: "#F3F4F6", borderRadius: 6, padding: "2px 8px" }}>Couleur : {c.couleur}</span>}
                  <span style={{ fontSize: 12, background: "#F3F4F6", borderRadius: 6, padding: "2px 8px" }}>Qté : {c.quantite}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#E07B2A" }}>{c.prix} €</span>
                </div>
                <p style={{ fontSize: 11, color: "#9CA3AF", margin: "6px 0 0" }}>{new Date(c.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
              </div>
              <select
                value={c.statut}
                onChange={(e) => changeStatut(c.id, e.target.value)}
                style={{ padding: "6px 12px", borderRadius: 8, border: `1.5px solid ${COLORS[c.statut]}`, fontSize: 12, fontWeight: 700, color: COLORS[c.statut], outline: "none", cursor: "pointer", background: "#fff" }}
              >
                {STATUTS.map((s) => <option key={s} value={s}>{LABELS[s]}</option>)}
              </select>
            </div>
          </div>
        ))}
        {commandes.length === 0 && <p style={{ color: "#9CA3AF", fontSize: 14, textAlign: "center" }}>Aucune commande</p>}
      </div>
    </div>
  );
}
