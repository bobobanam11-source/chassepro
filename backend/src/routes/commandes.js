const router = require("express").Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

// POST enregistrer une commande WhatsApp (public)
router.post("/", async (req, res) => {
  const { produit_id, nom_produit, prix, taille, couleur, quantite } = req.body;
  await db.query(
    "INSERT INTO commandes (produit_id, nom_produit, prix, taille, couleur, quantite) VALUES (?,?,?,?,?,?)",
    [produit_id || null, nom_produit, prix, taille || null, couleur || null, quantite || 1]
  );
  // Tracker le clic commander
  await db.query("INSERT INTO stats_clics (type, produit_id) VALUES ('commander', ?)", [produit_id || null]);
  res.status(201).json({ success: true });
});

// GET toutes les commandes (admin)
router.get("/", auth, async (req, res) => {
  const [rows] = await db.query("SELECT * FROM commandes ORDER BY created_at DESC");
  res.json(rows);
});

// PUT modifier statut (admin)
router.put("/:id", auth, async (req, res) => {
  await db.query("UPDATE commandes SET statut = ? WHERE id = ?", [req.body.statut, req.params.id]);
  res.json({ success: true });
});

module.exports = router;
