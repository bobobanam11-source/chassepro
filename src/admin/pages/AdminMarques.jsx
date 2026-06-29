import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const iStyle = { padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box" };

export default function AdminMarques() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ nom: "", description: "" });
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState(null);

  const load = () => api.get("/marques").then(setItems);
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append("logo", file);
    const base = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
    await fetch(editing ? `${base}/marques/${editing}` : `${base}/marques`, {
      method: editing ? "PUT" : "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
      body: fd,
    });
    setShowForm(false); setEditing(null); setFile(null); load();
  };

  const del = async (id) => { if (!confirm("Supprimer ?")) return; await api.del(`/marques/${id}`); load(); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 26, fontWeight: 800, color: "#111", margin: 0 }}>Marques</h1>
        <button onClick={() => { setForm({ nom: "", description: "" }); setEditing(null); setShowForm(true); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12, border: "none", background: "#1B3A2D", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          <Plus size={16} /> Ajouter
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((m) => (
          <div key={m.id} style={{ background: "#fff", borderRadius: 14, padding: "14px 18px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: 14 }}>
            {m.logo_url && <img src={m.logo_url} alt={m.nom} style={{ width: 44, height: 44, objectFit: "contain", borderRadius: 8, border: "1px solid #f0f0f0" }} />}
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: "#111", margin: 0 }}>{m.nom}</p>
              {m.description && <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>{m.description}</p>}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setForm({ nom: m.nom, description: m.description || "" }); setEditing(m.id); setShowForm(true); }} style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Pencil size={15} color="#374151" />
              </button>
              <button onClick={() => del(m.id)} style={{ width: 34, height: 34, borderRadius: 8, border: "none", background: "#FEF2F2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Trash2 size={14} color="#EF4444" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 440, padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 20, fontWeight: 800, margin: 0 }}>{editing ? "Modifier" : "Ajouter"} une marque</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input required value={form.nom} onChange={set("nom")} placeholder="Nom de la marque" style={iStyle} />
              <textarea value={form.description} onChange={set("description")} placeholder="Description" rows={2} style={{ ...iStyle, resize: "vertical", fontFamily: "inherit" }} />
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
