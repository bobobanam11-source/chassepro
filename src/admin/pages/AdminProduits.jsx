import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const iStyle = { padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box", background: "#fff" };
const empty = { nom: "", description: "", prix: "", prix_barre: "", marque_id: "", categorie_id: "", badge: "", note: "0", nb_avis: "0", emoji: "", couleur_fond: "#f5f5f5", actif: "1", tailles: { type: "alphanum", valeurs: [] }, couleurs: [] };

export default function AdminProduits() {
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [marques, setMarques] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [newCouleur, setNewCouleur] = useState({ nom: "", code_hex: "#ffffff" });

  const load = () => {
    api.get("/produits").then(setProduits);
    api.get("/categories").then(setCategories);
    api.get("/marques").then(setMarques);
  };

  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const openNew = () => { setForm(empty); setEditing(null); setImageFile(null); setShowForm(true); };
  const openEdit = (p) => {
    setForm({
      ...p,
      tailles: p.tailles?.[0] || { type: "alphanum", valeurs: [] },
      couleurs: p.couleurs || [],
    });
    setEditing(p.id);
    setImageFile(null);
    setShowForm(true);
  };

  const addCouleur = () => {
    if (!newCouleur.nom) return;
    setForm((f) => ({ ...f, couleurs: [...f.couleurs, { ...newCouleur }] }));
    setNewCouleur({ nom: "", code_hex: "#ffffff" });
  };

  const removeCouleur = (i) => setForm((f) => ({ ...f, couleurs: f.couleurs.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === "tailles") fd.append("tailles", JSON.stringify(v));
      else if (k === "couleurs") fd.append("couleurs", JSON.stringify(v));
      else fd.append(k, v);
    });
    if (imageFile) fd.append("image", imageFile);

    if (editing) await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000/api"}/produits/${editing}`, { method: "PUT", headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` }, body: fd });
    else await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000/api"}/produits`, { method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` }, body: fd });

    setShowForm(false);
    load();
  };

  const del = async (id) => {
    if (!confirm("Supprimer ce produit ?")) return;
    await api.del(`/produits/${id}`);
    load();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 26, fontWeight: 800, color: "#111", margin: 0 }}>Produits</h1>
        <button onClick={openNew} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12, border: "none", background: "#1B3A2D", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {/* Liste */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {produits.map((p) => (
          <div key={p.id} style={{ background: "#fff", borderRadius: 14, padding: "14px 18px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: p.couleur_fond || "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
              {p.image_url ? <img src={p.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10 }} /> : p.emoji}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: "#111", margin: 0 }}>{p.nom}</p>
              <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>{p.categorie_nom} · {p.prix} €{!p.actif ? " · 🔴 Désactivé" : ""}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => openEdit(p)} style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Pencil size={15} color="#374151" />
              </button>
              <button onClick={() => del(p.id)} style={{ width: 34, height: 34, borderRadius: 8, border: "none", background: "#FEF2F2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Trash2 size={15} color="#EF4444" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Formulaire modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, overflowY: "auto", padding: "20px 16px" }}>
          <div style={{ background: "#fff", borderRadius: 20, maxWidth: 640, margin: "0 auto", padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 20, fontWeight: 800, margin: 0 }}>{editing ? "Modifier" : "Ajouter"} un produit</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input required value={form.nom} onChange={set("nom")} placeholder="Nom du produit" style={iStyle} />
              <textarea value={form.description} onChange={set("description")} placeholder="Description" rows={3} style={{ ...iStyle, resize: "vertical", fontFamily: "inherit" }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <input required type="number" step="0.01" value={form.prix} onChange={set("prix")} placeholder="Prix (€)" style={iStyle} />
                <input type="number" step="0.01" value={form.prix_barre} onChange={set("prix_barre")} placeholder="Prix barré (€)" style={iStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <select value={form.categorie_id} onChange={set("categorie_id")} style={iStyle}>
                  <option value="">Catégorie</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
                </select>
                <select value={form.marque_id} onChange={set("marque_id")} style={iStyle}>
                  <option value="">Marque</option>
                  {marques.map((m) => <option key={m.id} value={m.id}>{m.nom}</option>)}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <select value={form.badge} onChange={set("badge")} style={iStyle}>
                  <option value="">Badge</option>
                  <option>Nouveau</option><option>Promo</option><option>Bestseller</option>
                </select>
                <input type="number" min="0" max="5" step="0.1" value={form.note} onChange={set("note")} placeholder="Note (0-5)" style={iStyle} />
                <input type="number" value={form.nb_avis} onChange={set("nb_avis")} placeholder="Nb avis" style={iStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <input value={form.emoji} onChange={set("emoji")} placeholder="Emoji (ex: 🧥)" style={iStyle} />
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="color" value={form.couleur_fond} onChange={set("couleur_fond")} style={{ width: 44, height: 44, borderRadius: 8, border: "1.5px solid #e5e7eb", cursor: "pointer", padding: 2 }} />
                  <input value={form.couleur_fond} onChange={set("couleur_fond")} placeholder="Couleur fond" style={{ ...iStyle, flex: 1 }} />
                </div>
              </div>

              {/* Tailles */}
              <div style={{ background: "#F9FAFB", borderRadius: 12, padding: 14 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", marginBottom: 10 }}>Système de tailles</p>
                <select value={form.tailles.type} onChange={(e) => setForm((f) => ({ ...f, tailles: { ...f.tailles, type: e.target.value, valeurs: [] } }))} style={iStyle}>
                  <option value="alphanum">S / M / L / XL</option>
                  <option value="cm">Pointure (cm)</option>
                  <option value="unique">Taille unique</option>
                  <option value="custom">Personnalisé</option>
                </select>
                {form.tailles.type !== "unique" && (
                  <input
                    style={{ ...iStyle, marginTop: 10 }}
                    placeholder={form.tailles.type === "alphanum" ? "Ex: S,M,L,XL" : form.tailles.type === "cm" ? "Ex: 40,41,42,43" : "Ex: 36,37,38"}
                    value={Array.isArray(form.tailles.valeurs) ? form.tailles.valeurs.join(",") : ""}
                    onChange={(e) => setForm((f) => ({ ...f, tailles: { ...f.tailles, valeurs: e.target.value.split(",").map((v) => v.trim()) } }))}
                  />
                )}
              </div>

              {/* Couleurs */}
              <div style={{ background: "#F9FAFB", borderRadius: 12, padding: 14 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", marginBottom: 10 }}>Variantes de couleur</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                  {form.couleurs.map((c, i) => (
                    <span key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 20, padding: "4px 10px", fontSize: 12 }}>
                      <span style={{ width: 12, height: 12, borderRadius: "50%", background: c.code_hex, display: "inline-block" }} />
                      {c.nom}
                      <button type="button" onClick={() => removeCouleur(i)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1 }}><X size={12} /></button>
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="color" value={newCouleur.code_hex} onChange={(e) => setNewCouleur((c) => ({ ...c, code_hex: e.target.value }))} style={{ width: 40, height: 40, borderRadius: 8, border: "1.5px solid #e5e7eb", cursor: "pointer" }} />
                  <input value={newCouleur.nom} onChange={(e) => setNewCouleur((c) => ({ ...c, nom: e.target.value }))} placeholder="Nom couleur" style={{ ...iStyle, flex: 1 }} />
                  <button type="button" onClick={addCouleur} style={{ padding: "0 14px", borderRadius: 10, border: "none", background: "#1B3A2D", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>+</button>
                </div>
              </div>

              {/* Image */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Photo produit</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} style={iStyle} />
              </div>

              {/* Actif */}
              <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                <input type="checkbox" checked={form.actif === "1" || form.actif === 1 || form.actif === true}
                  onChange={(e) => setForm((f) => ({ ...f, actif: e.target.checked ? "1" : "0" }))} />
                Produit visible sur le site
              </label>

              <button type="submit" style={{ padding: "14px", borderRadius: 12, border: "none", background: "#1B3A2D", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", marginTop: 8 }}>
                {editing ? "Modifier le produit" : "Ajouter le produit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
