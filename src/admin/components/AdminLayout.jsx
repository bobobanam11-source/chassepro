import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, Grid, Tag, ShoppingBag, Settings, BookOpen, Menu, X, LogOut, Image, User } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import SiteOff from "../../pages/SiteOff/SiteOff";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/produits", label: "Produits", icon: Package },
  { to: "/admin/categories", label: "Catégories", icon: Grid },
  { to: "/admin/marques", label: "Marques", icon: Tag },
  { to: "/admin/carousel", label: "Carousel", icon: Image },
  { to: "/admin/commandes", label: "Commandes", icon: ShoppingBag },
  { to: "/admin/parametres", label: "Paramètres", icon: Settings },
  { to: "/admin/profil", label: "Mon profil", icon: User },
  { to: "/admin/guide", label: "Guide", icon: BookOpen },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useSettings();

  if (settings?.site_actif === "false") return <SiteOff />;

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) navigate("/admin/login");
  }, [location.pathname]);

  const logout = () => { localStorage.removeItem("admin_token"); navigate("/admin/login"); };
  const isActive = (link) => link.exact ? location.pathname === link.to : location.pathname.startsWith(link.to);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F7F7F5" }}>
      {/* Overlay mobile */}
      {open && <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 40 }} />}

      {/* Sidebar */}
      <aside style={{
        width: 240, background: "#0a1a0f", flexShrink: 0,
        display: "flex", flexDirection: "column",
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease",
      }} className="admin-sidebar">
        <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "#1B3A2D", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🎯</div>
            <span style={{ fontFamily: "Playfair Display, serif", fontSize: 16, fontWeight: 800, color: "#fff" }}>Admin Panel</span>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
          {links.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 10, textDecoration: "none",
              fontSize: 13, fontWeight: isActive({ to, exact: to === "/admin" }) ? 700 : 500,
              color: isActive({ to, exact: to === "/admin" }) ? "#fff" : "rgba(255,255,255,0.55)",
              background: isActive({ to, exact: to === "/admin" }) ? "#1B3A2D" : "transparent",
              transition: "all 0.15s",
            }}>
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
        <button onClick={logout} style={{
          margin: "0 10px 16px", padding: "10px 12px", borderRadius: 10,
          background: "rgba(239,68,68,0.1)", border: "none", cursor: "pointer",
          color: "#EF4444", fontSize: 13, fontWeight: 600,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <LogOut size={16} /> Déconnexion
        </button>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", marginLeft: 0 }} className="admin-main">
        {/* Topbar mobile */}
        <header style={{
          height: 60, background: "#fff", borderBottom: "1px solid #f0f0f0",
          display: "flex", alignItems: "center", padding: "0 20px", gap: 16,
          position: "sticky", top: 0, zIndex: 30,
        }}>
          <button onClick={() => setOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <Menu size={22} color="#374151" />
          </button>
          <span style={{ fontFamily: "Playfair Display, serif", fontWeight: 700, fontSize: 16, color: "#111" }}>
            {links.find((l) => isActive({ to: l.to, exact: l.to === "/admin" }))?.label || "Admin"}
          </span>
        </header>

        <main style={{ flex: 1, padding: "24px 20px", maxWidth: 1100, width: "100%", margin: "0 auto" }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .admin-sidebar { transform: translateX(0) !important; }
          .admin-main { margin-left: 240px !important; }
        }
      `}</style>
    </div>
  );
}
