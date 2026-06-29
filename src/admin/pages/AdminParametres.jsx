import { useEffect, useState } from "react";
import { api } from "../../services/api";

const Field = ({ label, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</label>
    {children}
  </div>
);

const iStyle = { padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box" };

export default function AdminParametres() {
  const [settings, setSettings] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => { api.get("/settings").then(setSettings); }, []);

  const save = async (key) => {
    await api.put(`/settings/${key}`, { value: settings[key] });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const set = (key) => (e) => setSettings((s) => ({ ...s, [key]: e.target.value }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 26, fontWeight: 800, color: "#111", margin: 0 }}>Paramètres</h1>

      {saved && (
        <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "10px 16px", color: "#166534", fontWeight: 600, fontSize: 13 }}>
          ✅ Sauvegardé avec succès
        </div>
      )}

      {/* WhatsApp */}
      <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: 16 }}>
        <p style={{ fontWeight: 700, fontSize: 15, color: "#25D366", margin: 0 }}>💬 WhatsApp</p>
        <Field label="Numéro WhatsApp (avec indicatif, sans +)">
          <div style={{ display: "flex", gap: 10 }}>
            <input value={settings.whatsapp_number || ""} onChange={set("whatsapp_number")} placeholder="33757754353" style={iStyle} />
            <button onClick={() => save("whatsapp_number")} style={{ padding: "0 20px", borderRadius: 10, border: "none", background: "#25D366", color: "#fff", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", fontSize: 13 }}>
              Sauvegarder
            </button>
          </div>
        </Field>
        <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>Ce numéro sera utilisé pour le bouton Commander et le chatboard.</p>
      </div>

      {/* Nom du site */}
      <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: 16 }}>
        <p style={{ fontWeight: 700, fontSize: 15, color: "#111", margin: 0 }}>🏷️ Nom du site</p>
        <div style={{ display: "flex", gap: 10 }}>
          <input value={settings.site_nom || ""} onChange={set("site_nom")} placeholder="Garminchasse" style={iStyle} />
          <button onClick={() => save("site_nom")} style={{ padding: "0 20px", borderRadius: 10, border: "none", background: "#1B3A2D", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Sauvegarder</button>
        </div>
      </div>

      {/* Couleurs */}
      <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: 16 }}>
        <p style={{ fontWeight: 700, fontSize: 15, color: "#111", margin: 0 }}>🎨 Couleurs du site</p>
        {[
          { key: "couleur_primaire", label: "Couleur primaire" },
          { key: "couleur_secondaire", label: "Couleur secondaire" },
          { key: "couleur_accent", label: "Couleur accent" },
        ].map(({ key, label }) => (
          <Field key={key} label={label}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input type="color" value={settings[key] || "#000000"} onChange={set(key)}
                style={{ width: 44, height: 44, borderRadius: 8, border: "1.5px solid #e5e7eb", cursor: "pointer", padding: 2 }} />
              <input value={settings[key] || ""} onChange={set(key)} placeholder="#1B3A2D" style={{ ...iStyle, flex: 1 }} />
              <button onClick={() => save(key)} style={{ padding: "0 16px", height: 44, borderRadius: 10, border: "none", background: "#1B3A2D", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>OK</button>
            </div>
          </Field>
        ))}
      </div>
    </div>
  );
}
