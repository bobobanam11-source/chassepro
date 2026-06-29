import { useState } from "react";

export default function AdminProfil() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (form.newPassword !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    if (form.newPassword.length < 6) {
      setError("Le nouveau mot de passe doit faire au moins 6 caractères");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000/api"}/admin-profile/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`
        },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Mot de passe modifié avec succès !");
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setError(data.error || "Erreur lors du changement");
      }
    } catch {
      setError("Erreur de connexion");
    }
    setLoading(false);
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const iStyle = { padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 26, fontWeight: 800, color: "#111", margin: 0 }}>Mon profil</h1>

      <div style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.05)", maxWidth: 480 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111", marginBottom: 20 }}>🔐 Changer le mot de passe</h2>
        
        {message && (
          <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "12px 16px", color: "#166534", fontWeight: 600, fontSize: 14, marginBottom: 16 }}>
            ✅ {message}
          </div>
        )}
        
        {error && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", color: "#EF4444", fontWeight: 600, fontSize: 14, marginBottom: 16 }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
              Mot de passe actuel
            </label>
            <input
              type="password"
              required
              value={form.currentPassword}
              onChange={set("currentPassword")}
              style={iStyle}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
              Nouveau mot de passe
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={form.newPassword}
              onChange={set("newPassword")}
              style={iStyle}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
              Confirmer le nouveau mot de passe
            </label>
            <input
              type="password"
              required
              value={form.confirmPassword}
              onChange={set("confirmPassword")}
              style={iStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "13px 20px",
              borderRadius: 12,
              border: "none",
              background: "#1B3A2D",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
              marginTop: 8
            }}
          >
            {loading ? "Modification..." : "Modifier le mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
}