const router = require("express").Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

// GET carousel avec infos produit (public)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.id, c.ordre, p.* FROM carousel c
       JOIN produits p ON c.produit_id = p.id
       WHERE p.actif = 1 ORDER BY c.ordre ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error("GET /carousel error:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST ajouter un produit au carousel (admin)
router.post("/", auth, async (req, res) => {
  try {
    const { produit_id, ordre } = req.body;
    const [r] = await db.query("INSERT INTO carousel (produit_id, ordre) VALUES (?,?)", [produit_id, ordre || 0]);
    res.status(201).json({ id: r.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE retirer du carousel (admin)
router.delete("/:id", auth, async (req, res) => {
  try {
    await db.query("DELETE FROM carousel WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT réordonner (admin)
router.put("/:id", auth, async (req, res) => {
  try {
    await db.query("UPDATE carousel SET ordre = ? WHERE id = ?", [req.body.ordre, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
