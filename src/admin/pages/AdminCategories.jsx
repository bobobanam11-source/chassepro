import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const iStyle = { padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box" };
const empty = { nom: "", description: "", emoji: "", ordre: "0" };

export default function AdminCategories() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState(null);

  const load = () => api.get("/categories").then(setItems);
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append("photo", file);
    const base = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
    const url = editing ? `${base}/categories/${editing}` : `${base}/categories`;
    await fetch(url, { method: editing ? "PUT" : "POST", headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` }, body: fd });
    setShowForm(false); setEditing(null); setFile(null); load();
  };

  const del = async (id) => { if (!confirm("Supprimer ?")) return; await api.del(`/categories/${id}`); load(); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 26, fontWeight: 800, color: "#111", margin: 0 }}>Catégories</h1>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(true); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12, border: "none", background: "#1B3A2D", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          <Plus size={16} /> Ajouter
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
        {items.map((c) => (
          <div key={c.id} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            {c.photo_url && <img src={c.photo_url} alt={c.nom} style={{ width: "100%", height: 120, objectFit: "cover" }} />}
            {!c.photo_url && <div style={{ height: 80, background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>{c.emoji}</div>}
            <div style={{ padding: "12px 14px" }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: "#111", margin: 0 }}>{c.emoji} {c.nom}</p>
              <p style={{ fontSize: 12, color: "#9CA3AF", margin: "4px 0 10px" }}>Ordre : {c.ordre}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { setForm({ nom: c.nom, description: c.description || "", emoji: c.emoji || "", ordre: String(c.ordre) }); setEditing(c.id); setShowForm(true); }} style={{ flex: 1, padding: "7px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontSize: 12, fontWeight: 600 }}>
                  <Pencil size={13} /> Modifier
                </button>
                <button onClick={() => del(c.id)} style={{ width: 34, borderRadius: 8, border: "none", background: "#FEF2F2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Trash2 size={14} color="#EF4444" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 480, padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 20, fontWeight: 800, margin: 0 }}>{editing ? "Modifier" : "Ajouter"} une catégorie</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input required value={form.nom} onChange={set("nom")} placeholder="Nom" style={iStyle} />
              <textarea value={form.description} onChange={set("description")} placeholder="Description" rows={2} style={{ ...iStyle, resize: "vertical", fontFamily: "inherit" }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <input value={form.emoji} onChange={set("emoji")} placeholder="Emoji" style={iStyle} />
                <input type="number" value={form.ordre} onChange={set("ordre")} placeholder="Ordre" style={iStyle} />
              </div>
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} style={iStyle} />
              <button type="submit" style={{ padding: "13px", borderRadius: 12, border: "none", background: "#1B3A2D", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                {editing ? "Modifier" : "Ajouter"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
