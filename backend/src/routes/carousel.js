const router = require("express").Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

// GET carousel avec infos produit (public)
router.get("/", async (req, res) => {
  const [rows] = await db.query(
    `SELECT c.id, c.ordre, p.* FROM carousel c
     JOIN produits p ON c.produit_id = p.id
     WHERE p.actif = 1 ORDER BY c.ordre ASC`
  );
  res.json(rows);
});

// POST ajouter un produit au carousel (admin)
router.post("/", auth, async (req, res) => {
  const { produit_id, ordre } = req.body;
  const [r] = await db.query("INSERT INTO carousel (produit_id, ordre) VALUES (?,?)", [produit_id, ordre || 0]);
  res.status(201).json({ id: r.insertId });
});

// DELETE retirer du carousel (admin)
router.delete("/:id", auth, async (req, res) => {
  await db.query("DELETE FROM carousel WHERE id = ?", [req.params.id]);
  res.json({ success: true });
});

// PUT réordonner (admin)
router.put("/:id", auth, async (req, res) => {
  await db.query("UPDATE carousel SET ordre = ? WHERE id = ?", [req.body.ordre, req.params.id]);
  res.json({ success: true });
});

module.exports = router;
