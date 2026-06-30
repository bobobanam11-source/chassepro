import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Plus, Trash2 } from "lucide-react";

export default function AdminCarousel() {
  const [carousel, setCarousel] = useState([]);
  const [produits, setProduits] = useState([]);
  const [selected, setSelected] = useState("");

  const load = () => { api.get("/carousel").then(setCarousel); api.get("/produits").then(setProduits); };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!selected) return;
    await api.post("/carousel", { produit_id: selected, ordre: carousel.length });
    setSelected(""); load();
  };

  const del = async (id) => { await api.del(`/carousel/${id}`); load(); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 26, fontWeight: 800, color: "#111", margin: 0 }}>Carousel</h1>

      <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <p style={{ fontWeight: 700, fontSize: 13, color: "#374151", marginBottom: 12 }}>Ajouter un produit au carousel</p>
        <div style={{ display: "flex", gap: 10 }}>
          <select value={selected} onChange={(e) => setSelected(e.target.value)} style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none" }}>
            <option value="">Choisir un produit</option>
            {produits.filter((p) => !carousel.find((c) => c.produit_id === p.id)).map((p) => (
              <option key={p.id} value={p.id}>{p.emoji} {p.nom}</option>
            ))}
          </select>
          <button onClick={add} style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 20px", borderRadius: 10, border: "none", background: "#1B3A2D", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            <Plus size={16} /> Ajouter
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {carousel.map((item, i) => (
          <div key={item.id} style={{ background: "#fff", borderRadius: 14, padding: "14px 18px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", width: 24 }}>#{i + 1}</span>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: item.couleur_fond || "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
              {item.image_url ? <img src={item.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10 }} /> : item.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: "#111", margin: 0 }}>{item.nom}</p>
              <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>{item.prix} €</p>
            </div>
            <button onClick={() => del(item.id)} style={{ width: 34, height: 34, borderRadius: 8, border: "none", background: "#FEF2F2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Trash2 size={14} color="#EF4444" />
            </button>
          </div>
        ))}
        {carousel.length === 0 && <p style={{ color: "#9CA3AF", fontSize: 14, textAlign: "center" }}>Aucun produit dans le carousel</p>}
      </div>
    </div>
  );
}
