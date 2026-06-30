import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const iStyle = { padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box", background: "#fff" };
const empty = { nom: "", description: "", prix: "", prix_barre: "", marque_id: "", categorie_id: "", badge: "", actif: "1", tailles: { type: "alphanum", valeurs: [] }, couleurs: [] };

export default function AdminProduits() {
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [marques, setMarques] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [extraImages, setExtraImages] = useState([]);
  const [newCouleur, setNewCouleur] = useState({ nom: "", code_hex: "#ffffff", imageFile: null });
  const [loading, setLoading] = useState(false);

  const load = () => {
    api.get("/produits").then(setProduits);
    api.get("/categories").then(setCategories);
    api.get("/marques").then(setMarques);
  };

  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const openNew = () => { setForm(empty); setEditing(null); setImageFile(null); setExtraImages([]); setShowForm(true); };
  const openEdit = (p) => {
    setForm({ ...p, tailles: p.tailles?.[0] || { type: "alphanum", valeurs: [] }, couleurs: p.couleurs || [] });
    setEditing(p.id); setImageFile(null); setExtraImages([]); setShowForm(true);
  };

  const addCouleur = () => {
    if (!newCouleur.nom) return;
    setForm((f) => ({ ...f, couleurs: [...f.couleurs, { nom: newCouleur.nom, code_hex: newCouleur.code_hex, imageFile: newCouleur.imageFile }] }));
    setNewCouleur({ nom: "", code_hex: "#ffffff", imageFile: null });
  };

  const removeCouleur = (i) => setForm((f) => ({ ...f, couleurs: f.couleurs.filter((_, idx) => idx !== i) }));

  const deleteImage = async (imageId) => {
    if (!confirm("Supprimer cette photo ?")) return;
    await api.del(`/produits/${editing}/images/${imageId}`);
    load();
    openEdit(produits.find(p => p.id === editing));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "tailles") fd.append("tailles", JSON.stringify(v));
        else if (k === "couleurs") fd.append("couleurs", JSON.stringify(v.map(c => ({ nom: c.nom, code_hex: c.code_hex, image_url: c.image_url || null }))));
        else if (k !== "images") fd.append(k, v);
      });

      if (imageFile) fd.append("image", imageFile);

      // Photos supplémentaires
      extraImages.forEach(f => fd.append("images", f));

      // Photos par couleur
      form.couleurs.forEach(c => {
        if (c.imageFile) fd.append("couleur_images", c.imageFile);
        else fd.append("couleur_images", new Blob([]), "empty");
      });

      const base = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
      const url = editing ? `${base}/produits/${editing}` : `${base}/produits`;
      await fetch(url, { method: editing ? "PUT" : "POST", headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` }, body: fd });

      setShowForm(false); load();
    } catch (err) {
      alert("Erreur : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const del = async (id) => { if (!confirm("Supprimer ce produit ?")) return; await api.del(`/produits/${id}`); load(); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 26, fontWeight: 800, color: "#111", margin: 0 }}>Produits</h1>
        <button onClick={openNew} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12, border: "none", background: "#1B3A2D", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          <Plus size={16} /> Ajouter
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {produits.map((p) => (
          <div key={p.id} style={{ background: "#fff", borderRadius: 14, padding: "14px 18px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: "#f5f5f5", flexShrink: 0, overflow: "hidden" }}>
              {p.image_url ? <img src={p.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📦</div>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: "#111", margin: 0 }}>{p.nom}</p>
              <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>
                {p.categorie_nom || "—"} · {p.prix} €
                {p.images?.length > 0 && ` · 📷 ${p.images.length + 1} photos`}
                {!p.actif ? " · 🔴 Désactivé" : ""}
              </p>
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
        {produits.length === 0 && <p style={{ color: "#9CA3AF", fontSize: 14, textAlign: "center" }}>Aucun produit</p>}
      </div>

      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, overflowY: "auto", padding: "20px 16px" }}>
          <div style={{ background: "#fff", borderRadius: 20, maxWidth: 640, margin: "0 auto", padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 20, fontWeight: 800, margin: 0 }}>{editing ? "Modifier" : "Ajouter"} un produit</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Infos de base */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Nom du produit *</label>
                <input required value={form.nom} onChange={set("nom")} placeholder="Ex: Veste imperméable Browning" style={iStyle} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Description</label>
                <textarea value={form.description} onChange={set("description")} placeholder="Description du produit..." rows={3} style={{ ...iStyle, resize: "vertical", fontFamily: "inherit" }} />
              </div>

              {/* Prix */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Prix (€) *</label>
                  <input required type="number" step="0.01" value={form.prix} onChange={set("prix")} placeholder="0.00" style={iStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Prix barré (€) <span style={{ color: "#9CA3AF", fontWeight: 400 }}>optionnel</span></label>
                  <input type="number" step="0.01" value={form.prix_barre} onChange={set("prix_barre")} placeholder="0.00" style={iStyle} />
                </div>
              </div>

              {/* Catégorie / Marque */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Catégorie</label>
                  <select value={form.categorie_id} onChange={set("categorie_id")} style={iStyle}>
                    <option value="">Choisir...</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Marque</label>
                  <select value={form.marque_id} onChange={set("marque_id")} style={iStyle}>
                    <option value="">Choisir...</option>
                    {marques.map((m) => <option key={m.id} value={m.id}>{m.nom}</option>)}
                  </select>
                </div>
              </div>

              {/* Badge */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Badge <span style={{ color: "#9CA3AF", fontWeight: 400 }}>optionnel</span></label>
                <select value={form.badge} onChange={set("badge")} style={iStyle}>
                  <option value="">Aucun badge</option>
                  <option>Nouveau</option><option>Promo</option><option>Bestseller</option>
                </select>
              </div>

              {/* Photo principale */}
              <div style={{ background: "#F9FAFB", borderRadius: 12, padding: 14 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", marginBottom: 10 }}>📷 Photo principale</p>
                {editing && form.image_url && (
                  <img src={form.image_url} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, marginBottom: 8 }} />
                )}
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} style={iStyle} />
                {editing && <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>Laissez vide pour garder la photo actuelle</p>}
              </div>

              {/* Photos supplémentaires */}
              <div style={{ background: "#F9FAFB", borderRadius: 12, padding: 14 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", marginBottom: 10 }}>📷 Photos supplémentaires <span style={{ color: "#9CA3AF", fontWeight: 400, textTransform: "none" }}>(optionnel)</span></p>
                {editing && form.images?.length > 0 && (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                    {form.images.map((img) => (
                      <div key={img.id} style={{ position: "relative" }}>
                        <img src={img.image_url} alt="" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8 }} />
                        <button type="button" onClick={() => deleteImage(img.id)} style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: "#EF4444", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <X size={10} color="white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <input type="file" accept="image/*" multiple onChange={(e) => setExtraImages(Array.from(e.target.files))} style={iStyle} />
                <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>Vous pouvez sélectionner plusieurs photos à la fois</p>
              </div>

              {/* Tailles */}
              <div style={{ background: "#F9FAFB", borderRadius: 12, padding: 14 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", marginBottom: 10 }}>Tailles <span style={{ color: "#9CA3AF", fontWeight: 400, textTransform: "none" }}>(optionnel)</span></p>
                <select value={form.tailles.type} onChange={(e) => setForm((f) => ({ ...f, tailles: { ...f.tailles, type: e.target.value, valeurs: [] } }))} style={iStyle}>
                  <option value="alphanum">S / M / L / XL</option>
                  <option value="cm">Pointure (ex: 40,41,42)</option>
                  <option value="unique">Taille unique</option>
                  <option value="custom">Personnalisé</option>
                </select>
                {form.tailles.type !== "unique" && (
                  <input
                    style={{ ...iStyle, marginTop: 10 }}
                    placeholder={form.tailles.type === "alphanum" ? "Ex: S,M,L,XL,XXL" : "Ex: 40,41,42,43,44"}
                    value={Array.isArray(form.tailles.valeurs) ? form.tailles.valeurs.join(",") : ""}
                    onChange={(e) => setForm((f) => ({ ...f, tailles: { ...f.tailles, valeurs: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) } }))}
                  />
                )}
              </div>

              {/* Couleurs */}
              <div style={{ background: "#F9FAFB", borderRadius: 12, padding: 14 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", marginBottom: 10 }}>Couleurs <span style={{ color: "#9CA3AF", fontWeight: 400, textTransform: "none" }}>(optionnel)</span></p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
                  {form.couleurs.map((c, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "8px 12px" }}>
                      <span style={{ width: 20, height: 20, borderRadius: "50%", background: c.code_hex, flexShrink: 0, border: "1px solid #e5e7eb" }} />
                      <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{c.nom}</span>
                      {c.image_url && <img src={c.image_url} alt="" style={{ width: 32, height: 32, objectFit: "cover", borderRadius: 6 }} />}
                      {c.imageFile && <span style={{ fontSize: 11, color: "#1B3A2D" }}>📷 Photo ajoutée</span>}
                      <button type="button" onClick={() => removeCouleur(i)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={14} color="#EF4444" /></button>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 12 }}>
                  <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>Ajouter une couleur :</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input type="color" value={newCouleur.code_hex} onChange={(e) => setNewCouleur((c) => ({ ...c, code_hex: e.target.value }))} style={{ width: 40, height: 40, borderRadius: 8, border: "1.5px solid #e5e7eb", cursor: "pointer", padding: 2 }} />
                    <input value={newCouleur.nom} onChange={(e) => setNewCouleur((c) => ({ ...c, nom: e.target.value }))} placeholder="Nom (ex: Noir, Vert...)" style={{ ...iStyle, flex: 1 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: "#6B7280", display: "block", marginBottom: 4 }}>Photo pour cette couleur (optionnel)</label>
                    <input type="file" accept="image/*" onChange={(e) => setNewCouleur((c) => ({ ...c, imageFile: e.target.files[0] }))} style={iStyle} />
                  </div>
                  <button type="button" onClick={addCouleur} style={{ padding: "8px", borderRadius: 8, border: "none", background: "#1B3A2D", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
                    + Ajouter cette couleur
                  </button>
                </div>
              </div>

              {/* Visible */}
              <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                <input type="checkbox" checked={form.actif === "1" || form.actif === 1 || form.actif === true} onChange={(e) => setForm((f) => ({ ...f, actif: e.target.checked ? "1" : "0" }))} />
                Produit visible sur le site
              </label>

              <button type="submit" disabled={loading} style={{ padding: "14px", borderRadius: 12, border: "none", background: "#1B3A2D", color: "#fff", fontWeight: 700, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginTop: 8 }}>
                {loading ? "En cours..." : editing ? "Modifier le produit" : "Ajouter le produit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
