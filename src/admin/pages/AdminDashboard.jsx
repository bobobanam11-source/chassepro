import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Users, MousePointerClick, MessageCircle, ShoppingBag, TrendingUp, Power } from "lucide-react";

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

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [siteActif, setSiteActif] = useState(true);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    api.get("/stats/dashboard").then(setStats);
    api.get("/settings").then((s) => setSiteActif(s.site_actif === "true"));
  }, []);

  const toggleSite = async () => {
    const newVal = String(!siteActif);
    await api.put("/settings/site_actif", { value: newVal });
    setSiteActif(!siteActif);
    setConfirm(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 26, fontWeight: 800, color: "#111", margin: 0 }}>Dashboard</h1>
        <button
          onClick={() => setConfirm(true)}
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
            borderRadius: 12, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13,
            background: siteActif ? "#EF4444" : "#22C55E", color: "#fff",
          }}
        >
          <Power size={16} />
          {siteActif ? "Mettre hors ligne" : "Remettre en ligne"}
        </button>
      </div>

      {/* Confirmation */}
      {confirm && (
        <div style={{ background: siteActif ? "#FEF2F2" : "#F0FDF4", border: `1px solid ${siteActif ? "#FECACA" : "#BBF7D0"}`, borderRadius: 12, padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <p style={{ margin: 0, fontWeight: 600, color: siteActif ? "#EF4444" : "#22C55E", fontSize: 14 }}>
            {siteActif ? "⚠️ Confirmer la mise hors ligne du site ?" : "✅ Remettre le site en ligne ?"}
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={toggleSite} style={{ padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, background: siteActif ? "#EF4444" : "#22C55E", color: "#fff", fontSize: 13 }}>Confirmer</button>
            <button onClick={() => setConfirm(false)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e5e7eb", cursor: "pointer", fontWeight: 600, background: "#fff", fontSize: 13 }}>Annuler</button>
          </div>
        </div>
      )}

      {/* Statut site */}
      <div style={{ background: siteActif ? "#F0FDF4" : "#FEF2F2", border: `1px solid ${siteActif ? "#BBF7D0" : "#FECACA"}`, borderRadius: 12, padding: "12px 16px" }}>
        <p style={{ margin: 0, fontWeight: 700, color: siteActif ? "#166534" : "#EF4444", fontSize: 14 }}>
          {siteActif ? "🟢 Site en ligne" : "🔴 Site hors ligne"}
        </p>
      </div>

      {/* Cards stats */}
      {stats ? (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <StatCard icon={Users} label="Visiteurs uniques" value={stats.visiteurs} color="#3B82F6" />
            <StatCard icon={MousePointerClick} label="Clics Commander" value={stats.clics_commander} color="#E07B2A" />
            <StatCard icon={MessageCircle} label="Clics WhatsApp" value={stats.clics_chatboard} color="#25D366" />
            <StatCard icon={ShoppingBag} label="Commandes ce mois" value={stats.commandes_month} color="#1B3A2D" />
            <StatCard icon={TrendingUp} label="CA ce mois (€)" value={`${Number(stats.ca_month).toFixed(2)} €`} color="#F59E0B" />
          </div>

          {/* Mini graphique visites 7j */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <p style={{ fontWeight: 700, fontSize: 15, color: "#111", marginBottom: 16 }}>Visites — 7 derniers jours</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
              {stats.visites7j.map((v) => {
                const max = Math.max(...stats.visites7j.map((x) => x.total), 1);
                return (
                  <div key={v.jour} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ width: "100%", background: "#1B3A2D", borderRadius: 4, height: `${(v.total / max) * 70}px`, minHeight: 4, transition: "height 0.3s" }} />
                    <span style={{ fontSize: 10, color: "#9CA3AF" }}>{v.jour?.slice(5)}</span>
                  </div>
                );
              })}
              {stats.visites7j.length === 0 && <p style={{ color: "#9CA3AF", fontSize: 13 }}>Aucune donnée</p>}
            </div>
          </div>
        </>
      ) : (
        <p style={{ color: "#9CA3AF" }}>Chargement...</p>
      )}
    </div>
  );
}
