const sections = [
  {
    title: "📦 Ajouter / modifier un produit",
    content: `1. Allez dans "Produits" → cliquez "Ajouter"\n2. Remplissez le nom, description, prix, catégorie, marque\n3. Choisissez le badge (Nouveau, Promo, Bestseller) si applicable\n4. Définissez le système de tailles : S/M/L/XL, pointures cm, taille unique ou personnalisé\n5. Ajoutez des variantes de couleur avec nom + code couleur\n6. Uploadez une photo (JPEG/PNG, max 2MB recommandé, ratio 1:1 idéal)\n7. Cochez "Visible sur le site" pour l'activer\n8. Cliquez "Ajouter le produit"`,
  },
  {
    title: "🗂️ Gérer les catégories",
    content: `1. Allez dans "Catégories" → cliquez "Ajouter"\n2. Donnez un nom, un emoji et une description\n3. Uploadez une photo d'affiche (format paysage 16:9 recommandé, min 800px de large)\n4. Définissez l'ordre d'affichage (0 = premier)\n5. Sauvegardez`,
  },
  {
    title: "🏷️ Gérer les marques",
    content: `1. Allez dans "Marques" → cliquez "Ajouter"\n2. Entrez le nom et une description courte\n3. Uploadez le logo (PNG transparent recommandé, format carré)\n4. Sauvegardez — la marque sera disponible dans les formulaires produit`,
  },
  {
    title: "🎠 Gérer le carousel",
    content: `1. Allez dans "Carousel"\n2. Sélectionnez un produit dans la liste déroulante\n3. Cliquez "Ajouter" — il apparaît dans le carousel de la page d'accueil\n4. Pour le retirer, cliquez la corbeille\n5. L'ordre d'affichage correspond à l'ordre d'ajout`,
  },
  {
    title: "💬 Changer le numéro WhatsApp",
    content: `1. Allez dans "Paramètres"\n2. Section "WhatsApp" — entrez le numéro avec l'indicatif, SANS le +\n   Exemple : 33757754353 pour le +33 7 57 75 43 53\n3. Cliquez "Sauvegarder"\n4. Le changement s'applique immédiatement sur le bouton Commander et le chatboard`,
  },
  {
    title: "🎨 Changer les couleurs du site",
    content: `1. Allez dans "Paramètres" → section "Couleurs"\n2. Utilisez le sélecteur de couleur ou entrez un code HEX\n3. Couleur primaire : couleur principale (menus, boutons)\n4. Couleur secondaire : couleur d'accent (prix, badges)\n5. Cliquez "OK" pour chaque couleur — le changement s'applique en temps réel`,
  },
  {
    title: "🔴 Activer / désactiver le site",
    content: `1. Allez dans "Dashboard"\n2. Cliquez "Mettre hors ligne" (bouton rouge)\n3. Confirmez — le site affiche une page ❌ "Site indisponible" à tous les visiteurs\n4. Pour remettre en ligne, cliquez "Remettre en ligne" (bouton vert)\n⚠️ Même vous verrez la page hors service si vous visitez le site normal — seul /admin/login reste accessible`,
  },
  {
    title: "📊 Lire les statistiques",
    content: `Le Dashboard affiche :\n• Visiteurs uniques : nombre de sessions distinctes\n• Clics Commander : combien de fois le bouton "Commander" a été cliqué\n• Clics WhatsApp : combien de fois le chatboard a été cliqué\n• Commandes ce mois : nombre de commandes enregistrées\n• CA ce mois : chiffre d'affaires estimé (basé sur les commandes WhatsApp)\n• Graphique visites 7 jours : tendance des visites quotidiennes`,
  },
  {
    title: "🖼️ Conseils pour les photos",
    content: `• Format : JPEG ou PNG\n• Taille recommandée : moins de 2MB\n• Produits : ratio carré (1:1), min 600x600px\n• Catégories : format paysage (16:9), min 800x450px\n• Logos marques : PNG avec fond transparent, format carré\n• Évitez les images trop sombres ou floues\n• Utilisez des photos nettes sur fond neutre pour les produits`,
  },
];

export default function AdminGuide() {
  const [open, setOpen] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 26, fontWeight: 800, color: "#111", margin: 0 }}>Guide d'utilisation</h1>
        <p style={{ color: "#9CA3AF", fontSize: 14, marginTop: 6 }}>Tout ce que vous devez savoir pour gérer votre boutique.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sections.map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{ width: "100%", padding: "16px 20px", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}
            >
              <span style={{ fontWeight: 700, fontSize: 15, color: "#111" }}>{s.title}</span>
              <span style={{ fontSize: 18, color: "#9CA3AF", transform: open === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>▾</span>
            </button>
            {open === i && (
              <div style={{ padding: "0 20px 20px" }}>
                <pre style={{ fontFamily: "inherit", fontSize: 13, color: "#4B5563", lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>{s.content}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
