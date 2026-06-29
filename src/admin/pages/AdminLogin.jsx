import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await api.post("/auth/login", form);
    setLoading(false);
    if (res.token) {
      localStorage.setItem("admin_token", res.token);
      navigate("/admin");
    } else {
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F5", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "48px 40px", width: "100%", maxWidth: 400, boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, background: "#1B3A2D", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, margin: "0 auto 16px" }}>🎯</div>
          <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 24, fontWeight: 800, color: "#111", margin: 0 }}>Admin Panel</h1>
          <p style={{ color: "#9CA3AF", fontSize: 13, marginTop: 6 }}>Garminchasse</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input
            type="email" required placeholder="Email" value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            style={{ padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none" }}
          />
          <input
            type="password" required placeholder="Mot de passe" value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            style={{ padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none" }}
          />
          {error && <p style={{ color: "#EF4444", fontSize: 13, margin: 0 }}>{error}</p>}
          <button type="submit" disabled={loading} style={{
            padding: "13px", borderRadius: 12, border: "none",
            background: "#1B3A2D", color: "#fff", fontWeight: 700, fontSize: 14,
            cursor: "pointer", opacity: loading ? 0.7 : 1,
          }}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
