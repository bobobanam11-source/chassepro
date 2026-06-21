import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapPin, Phone, User, Tag, CheckCircle, ChevronDown } from "lucide-react";

const DEPARTEMENTS = [
  "01 - Ain", "02 - Aisne", "03 - Allier", "04 - Alpes-de-Haute-Provence",
  "05 - Hautes-Alpes", "06 - Alpes-Maritimes", "07 - Ardèche", "08 - Ardennes",
  "09 - Ariège", "10 - Aube", "11 - Aude", "12 - Aveyron",
  "13 - Bouches-du-Rhône", "14 - Calvados", "15 - Cantal", "16 - Charente",
  "17 - Charente-Maritime", "18 - Cher", "19 - Corrèze", "21 - Côte-d'Or",
  "22 - Côtes-d'Armor", "23 - Creuse", "24 - Dordogne", "25 - Doubs",
  "26 - Drôme", "27 - Eure", "28 - Eure-et-Loir", "29 - Finistère",
  "30 - Gard", "31 - Haute-Garonne", "32 - Gers", "33 - Gironde",
  "34 - Hérault", "35 - Ille-et-Vilaine", "36 - Indre", "37 - Indre-et-Loire",
  "38 - Isère", "39 - Jura", "40 - Landes", "41 - Loir-et-Cher",
  "42 - Loire", "43 - Haute-Loire", "44 - Loire-Atlantique", "45 - Loiret",
  "46 - Lot", "47 - Lot-et-Garonne", "48 - Lozère", "49 - Maine-et-Loire",
  "50 - Manche", "51 - Marne", "52 - Haute-Marne", "53 - Mayenne",
  "54 - Meurthe-et-Moselle", "55 - Meuse", "56 - Morbihan", "57 - Moselle",
  "58 - Nièvre", "59 - Nord", "60 - Oise", "61 - Orne",
  "62 - Pas-de-Calais", "63 - Puy-de-Dôme", "64 - Pyrénées-Atlantiques",
  "65 - Hautes-Pyrénées", "66 - Pyrénées-Orientales", "67 - Bas-Rhin",
  "68 - Haut-Rhin", "69 - Rhône", "70 - Haute-Saône", "71 - Saône-et-Loire",
  "72 - Sarthe", "73 - Savoie", "74 - Haute-Savoie", "75 - Paris",
  "76 - Seine-Maritime", "77 - Seine-et-Marne", "78 - Yvelines",
  "79 - Deux-Sèvres", "80 - Somme", "81 - Tarn", "82 - Tarn-et-Garonne",
  "83 - Var", "84 - Vaucluse", "85 - Vendée", "86 - Vienne",
  "87 - Haute-Vienne", "88 - Vosges", "89 - Yonne", "90 - Territoire de Belfort",
  "91 - Essonne", "92 - Hauts-de-Seine", "93 - Seine-Saint-Denis",
  "94 - Val-de-Marne", "95 - Val-d'Oise",
  "971 - Guadeloupe", "972 - Martinique", "973 - Guyane", "974 - La Réunion", "976 - Mayotte",
];

const Field = ({ label, icon: Icon, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 6 }}>
      {Icon && <Icon size={13} color="#1B3A2D" />} {label}
    </label>
    {children}
  </div>
);

const inputStyle = {
  padding: "12px 14px",
  borderRadius: 10,
  border: "1.5px solid #e5e7eb",
  fontSize: 14,
  color: "#111",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  background: "#fff",
};

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product || null;

  const [form, setForm] = useState({
    prenom: "", nom: "", adresse: "", ville: "",
    codePostal: "", departement: "", telephone: "",
    codeParrainage: "", instructions: "",
  });
  const [done, setDone] = useState(false);
  const [focused, setFocused] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setDone(true);
  };

  const iStyle = (k) => ({
    ...inputStyle,
    borderColor: focused === k ? "#1B3A2D" : "#e5e7eb",
    transition: "border-color 0.2s",
  });

  if (done) {
    return (
      <div style={{ minHeight: "100vh", background: "#F7F7F5", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "56px 48px", textAlign: "center", maxWidth: 480, boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
          <CheckCircle size={64} color="#1B3A2D" style={{ margin: "0 auto 20px" }} />
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 12 }}>
            Commande confirmée !
          </h2>
          <p style={{ color: "#6B7280", fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
            Merci {form.prenom} ! Votre commande est enregistrée et sera livrée à <strong>{form.ville}</strong> ({form.departement.split(" ")[0]}).
            {form.codeParrainage && <> Code parrainage <strong>{form.codeParrainage}</strong> appliqué ✓</>}
          </p>
          <button
            onClick={() => navigate("/")}
            style={{ padding: "13px 32px", borderRadius: 12, border: "none", background: "#1B3A2D", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F5", paddingTop: 100, paddingBottom: 60 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>
        {/* Titre */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ width: 28, height: 3, borderRadius: 2, background: "#E07B2A", display: "inline-block" }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#E07B2A" }}>Livraison France</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(24px,4vw,36px)", fontWeight: 800, color: "#111827" }}>
            Finaliser ma commande
          </h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }} className="checkout-grid">
          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            <div style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 2px 16px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#1B3A2D", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
                📦 Adresse de livraison
              </p>

              {/* Prénom + Nom */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Field label="Prénom" icon={User}>
                  <input required value={form.prenom} onChange={set("prenom")} placeholder="Jean" style={iStyle("prenom")}
                    onFocus={() => setFocused("prenom")} onBlur={() => setFocused("")} />
                </Field>
                <Field label="Nom">
                  <input required value={form.nom} onChange={set("nom")} placeholder="Dupont" style={iStyle("nom")}
                    onFocus={() => setFocused("nom")} onBlur={() => setFocused("")} />
                </Field>
              </div>

              {/* Adresse */}
              <Field label="Adresse" icon={MapPin}>
                <input required value={form.adresse} onChange={set("adresse")} placeholder="12 rue des Chasseurs" style={iStyle("adresse")}
                  onFocus={() => setFocused("adresse")} onBlur={() => setFocused("")} />
              </Field>

              {/* Ville + Code postal */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 130px", gap: 14 }}>
                <Field label="Ville">
                  <input required value={form.ville} onChange={set("ville")} placeholder="Paris" style={iStyle("ville")}
                    onFocus={() => setFocused("ville")} onBlur={() => setFocused("")} />
                </Field>
                <Field label="Code postal">
                  <input required value={form.codePostal} onChange={set("codePostal")} placeholder="75001" maxLength={5}
                    pattern="[0-9]{5}" style={iStyle("codePostal")}
                    onFocus={() => setFocused("codePostal")} onBlur={() => setFocused("")} />
                </Field>
              </div>

              {/* Département */}
              <Field label="Département" icon={MapPin}>
                <div style={{ position: "relative" }}>
                  <select required value={form.departement} onChange={set("departement")}
                    style={{ ...iStyle("departement"), appearance: "none", paddingRight: 36, color: form.departement ? "#111" : "#9CA3AF" }}
                    onFocus={() => setFocused("departement")} onBlur={() => setFocused("")}
                  >
                    <option value="">Sélectionner un département</option>
                    {DEPARTEMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown size={16} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} />
                </div>
              </Field>

              {/* Téléphone */}
              <Field label="Téléphone" icon={Phone}>
                <input required value={form.telephone} onChange={set("telephone")} placeholder="06 12 34 56 78"
                  type="tel" style={iStyle("telephone")}
                  onFocus={() => setFocused("telephone")} onBlur={() => setFocused("")} />
              </Field>

              {/* Instructions */}
              <Field label="Instructions (optionnel)">
                <textarea value={form.instructions} onChange={set("instructions")} placeholder="Digicode, étage, instructions particulières..."
                  rows={3} style={{ ...iStyle("instructions"), resize: "vertical", fontFamily: "inherit" }}
                  onFocus={() => setFocused("instructions")} onBlur={() => setFocused("")} />
              </Field>

              <hr style={{ border: "none", borderTop: "1px solid #f0f0f0" }} />

              {/* Code parrainage */}
              <Field label="Code parrainage (optionnel)" icon={Tag}>
                <div style={{ position: "relative" }}>
                  <input value={form.codeParrainage} onChange={set("codeParrainage")} placeholder="Ex: CHASSE2024"
                    style={{ ...iStyle("codeParrainage"), textTransform: "uppercase" }}
                    onFocus={() => setFocused("codeParrainage")} onBlur={() => setFocused("")} />
                  {form.codeParrainage && (
                    <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 11, fontWeight: 700, color: "#1B3A2D" }}>
                      ✓ Appliqué
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>Vous avez un code de parrainage ? Entrez-le ici pour bénéficier d'une réduction.</p>
              </Field>

              <button type="submit" style={{
                padding: "15px", borderRadius: 12, border: "none",
                background: "linear-gradient(135deg, #1B3A2D 0%, #2d5a40 100%)",
                color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer",
                boxShadow: "0 6px 20px rgba(27,58,45,0.3)", marginTop: 4,
              }}>
                ✓ Confirmer la commande
              </button>
            </div>
          </form>

          {/* Récapitulatif */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 16px rgba(0,0,0,0.05)", position: "sticky", top: 100 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#1B3A2D", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
              🛒 Récapitulatif
            </p>
            {product ? (
              <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 56, height: 56, borderRadius: 10, background: product.couleurFond || "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
                  {product.emoji}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#111", lineHeight: 1.4, marginBottom: 4 }}>{product.nom}</p>
                  <p style={{ fontSize: 16, fontWeight: 800, color: "#E07B2A" }}>{product.prix.toFixed(2)} €</p>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 20 }}>Votre panier sera affiché ici.</p>
            )}

            <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Livraison", value: "Offerte" },
                { label: "Retours", value: "30 jours" },
                { label: "Paiement", value: "Sécurisé" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#6B7280" }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: "#1B3A2D" }}>{item.value}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20, padding: "12px 16px", background: "#F0FDF4", borderRadius: 10, border: "1px solid #BBF7D0" }}>
              <p style={{ fontSize: 12, color: "#166534", fontWeight: 600, margin: 0 }}>
                🔒 Livraison rapide partout en France métropolitaine et DOM-TOM
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
