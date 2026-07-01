const router = require("express").Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

// POST enregistrer une commande WhatsApp (public)
router.post("/", async (req, res) => {
  try {
    const { produit_id, nom_produit, prix, taille, couleur, quantite } = req.body;
    await db.query(
      "INSERT INTO commandes (produit_id, nom_produit, prix, taille, couleur, quantite) VALUES (?,?,?,?,?,?)",
      [produit_id || null, nom_produit, prix, taille || null, couleur || null, quantite || 1]
    );
    await db.query("INSERT INTO stats_clics (type, produit_id) VALUES ('commander', ?)", [produit_id || null]);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET toutes les commandes (admin)
router.get("/", auth, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM commandes ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT modifier statut (admin)
router.put("/:id", auth, async (req, res) => {
  try {
    await db.query("UPDATE commandes SET statut = ? WHERE id = ?", [req.body.statut, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
