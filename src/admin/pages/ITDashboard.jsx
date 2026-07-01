import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, MousePointerClick, MessageCircle, ShoppingBag, TrendingUp, Power, LogOut, Settings } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon size={22} color={color} />
    </div>
    <div>
      <p style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 800, color: "#111", margin: 0, lineHeight: 1.2 }}>{value}</p>
    </div>
  </div>
);

export default function ITDashboard() {
  const [stats, setStats] = useState(null);
  const [visiteurs, setVisiteurs] = useState([]);
  const [siteActif, setSiteActif] = useState(true);
  const [confirm, setConfirm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("it_admin_token")) navigate("/it-admin/login");
    
    const fetchStats = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000/api"}/stats/dashboard`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("it_admin_token")}` }
      });
      setStats(await res.json());
    };
    
    const fetchSettings = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000/api"}/settings`);
      const data = await res.json();
      setSiteActif(data.site_actif === "true");
    };

    fetchStats();
    fetchSettings();

    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000/api"}/stats/visiteurs`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("it_admin_token")}` }
    }).then(r => r.json()).then(data => { if (Array.isArray(data)) setVisiteurs(data); }).catch(() => {});
  }, []);

  const toggleSite = async () => {
    const newVal = String(!siteActif);
    await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000/api"}/settings/site_actif`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("it_admin_token")}` },
      body: JSON.stringify({ value: newVal })
    });
    setSiteActif(!siteActif);
    setConfirm(false);
  };

  const logout = () => { localStorage.removeItem("it_admin_token"); navigate("/it-admin/login"); };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Le nouveau mot de passe doit faire au moins 6 caractères");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000/api"}/it-profile/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("it_admin_token")}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await res.json();
      if (res.ok) {
        setPasswordMessage("Mot de passe modifié avec succès !");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => setShowPasswordForm(false), 2000);
      } else {
        setPasswordError(data.error || "Erreur lors du changement");
      }
    } catch {
      setPasswordError("Erreur de connexion");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", padding: 24 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, background: "#EF4444", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>⚡</div>
            <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 28, fontWeight: 800, margin: 0 }}>IT Dashboard</h1>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowPasswordForm(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12, border: "1px solid #374151", background: "transparent", color: "#9CA3AF", cursor: "pointer", fontSize: 13 }}>
              <Settings size={16} /> Mot de passe
            </button>
            <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12, border: "1px solid #374151", background: "transparent", color: "#9CA3AF", cursor: "pointer", fontSize: 13 }}>
              <LogOut size={16} /> Déconnexion
            </button>
          </div>
        </div>

        {/* Contrôle site */}
        <div style={{ background: "#1a1a1a", borderRadius: 16, padding: 24, marginBottom: 24, border: "1px solid #374151" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>Contrôle du site</h3>
              <p style={{ color: siteActif ? "#22C55E" : "#EF4444", fontSize: 14, margin: 0, fontWeight: 600 }}>
                {siteActif ? "🟢 Site en ligne" : "🔴 Site hors ligne"}
              </p>
            </div>
            <button
              onClick={() => setConfirm(true)}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "12px 24px",
                borderRadius: 12, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14,
                background: siteActif ? "#EF4444" : "#22C55E", color: "#fff",
              }}
            >
              <Power size={16} />
              {siteActif ? "Mettre hors ligne" : "Remettre en ligne"}
            </button>
          </div>

          {confirm && (
            <div style={{ marginTop: 16, padding: 16, background: siteActif ? "#7F1D1D" : "#14532D", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <p style={{ margin: 0, fontWeight: 600, color: "#fff", fontSize: 14 }}>
                {siteActif ? "⚠️ Confirmer la mise hors ligne ?" : "✅ Remettre le site en ligne ?"}
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={toggleSite} style={{ padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, background: siteActif ? "#EF4444" : "#22C55E", color: "#fff", fontSize: 13 }}>Confirmer</button>
                <button onClick={() => setConfirm(false)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #6B7280", cursor: "pointer", fontWeight: 600, background: "transparent", color: "#9CA3AF", fontSize: 13 }}>Annuler</button>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        {stats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 24 }}>
            <StatCard icon={Users} label="Visiteurs uniques" value={stats.visiteurs} color="#3B82F6" />
            <StatCard icon={MousePointerClick} label="Clics Commander" value={stats.clics_commander} color="#E07B2A" />
            <StatCard icon={MessageCircle} label="Clics WhatsApp" value={stats.clics_chatboard} color="#25D366" />
            <StatCard icon={ShoppingBag} label="Commandes mois" value={stats.commandes_month} color="#1B3A2D" />
            <StatCard icon={TrendingUp} label="CA mois (€)" value={`${Number(stats.ca_month).toFixed(2)} €`} color="#F59E0B" />
          </div>
        )}

        {/* Graphique */}
        {stats && (
          <div style={{ background: "#1a1a1a", borderRadius: 16, padding: 24, border: "1px solid #374151" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Visites — 7 derniers jours</h3>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
              {stats.visites7j.map((v) => {
                const max = Math.max(...stats.visites7j.map((x) => x.total), 1);
                return (
                  <div key={v.jour} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ width: "100%", background: "#EF4444", borderRadius: 4, height: `${(v.total / max) * 70}px`, minHeight: 4 }} />
                    <span style={{ fontSize: 10, color: "#9CA3AF" }}>{v.jour?.slice(5)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Visiteurs par pays/ville */}
        <div style={{ background: "#1a1a1a", borderRadius: 16, padding: 24, border: "1px solid #374151", marginTop: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🌍 Visiteurs par pays / ville</h3>
          {visiteurs.length === 0 ? (
            <p style={{ color: "#6B7280", fontSize: 13 }}>Aucune donnée géographique pour l'instant.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #374151" }}>
                  <th style={{ textAlign: "left", padding: "8px 12px", color: "#9CA3AF", fontWeight: 600 }}>Pays</th>
                  <th style={{ textAlign: "left", padding: "8px 12px", color: "#9CA3AF", fontWeight: 600 }}>Ville</th>
                  <th style={{ textAlign: "right", padding: "8px 12px", color: "#9CA3AF", fontWeight: 600 }}>Visiteurs</th>
                </tr>
              </thead>
              <tbody>
                {visiteurs.map((v, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #1f1f1f" }}>
                    <td style={{ padding: "10px 12px", color: "#fff" }}>{v.pays}</td>
                    <td style={{ padding: "10px 12px", color: "#9CA3AF" }}>{v.ville || "—"}</td>
                    <td style={{ padding: "10px 12px", color: "#EF4444", fontWeight: 700, textAlign: "right" }}>{v.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal changement mot de passe */}
        {showPasswordForm && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ background: "#1a1a1a", borderRadius: 20, padding: 28, width: "100%", maxWidth: 440, border: "1px solid #374151" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#fff" }}>🔐 Changer le mot de passe</h2>
                <button onClick={() => setShowPasswordForm(false)} style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", fontSize: 20 }}>×</button>
              </div>

              {passwordMessage && (
                <div style={{ background: "#14532D", border: "1px solid #BBF7D0", borderRadius: 10, padding: "10px 14px", color: "#22C55E", fontSize: 13, marginBottom: 16 }}>
                  ✅ {passwordMessage}
                </div>
              )}
              
              {passwordError && (
                <div style={{ background: "#7F1D1D", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", color: "#EF4444", fontSize: 13, marginBottom: 16 }}>
                  ❌ {passwordError}
                </div>
              )}

              <form onSubmit={handlePasswordChange} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <input
                  type="password"
                  required
                  placeholder="Mot de passe actuel"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))}
                  style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid #374151", background: "#0a0a0a", color: "#fff", fontSize: 14, outline: "none" }}
                />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Nouveau mot de passe"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
                  style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid #374151", background: "#0a0a0a", color: "#fff", fontSize: 14, outline: "none" }}
                />
                <input
                  type="password"
                  required
                  placeholder="Confirmer le nouveau mot de passe"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid #374151", background: "#0a0a0a", color: "#fff", fontSize: 14, outline: "none" }}
                />
                <button type="submit" style={{ padding: "13px", borderRadius: 12, border: "none", background: "#EF4444", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                  Modifier le mot de passe
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}