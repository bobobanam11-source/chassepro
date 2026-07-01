const router = require("express").Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

// POST tracker une visite (public)
router.post("/visite", async (req, res) => {
  try {
    const { session_id, page } = req.body;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    await db.query("INSERT INTO stats_visites (session_id, ip, page) VALUES (?,?,?)", [session_id, ip, page]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST tracker clic chatboard (public)
router.post("/chatboard", async (req, res) => {
  try {
    await db.query("INSERT INTO stats_clics (type, produit_id) VALUES ('chatboard', NULL)");
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET dashboard stats (admin)
router.get("/dashboard", auth, async (req, res) => {
  try {
    const [[{ visiteurs }]] = await db.query("SELECT COUNT(DISTINCT session_id) AS visiteurs FROM stats_visites");
    const [[{ clics_commander }]] = await db.query("SELECT COUNT(*) AS clics_commander FROM stats_clics WHERE type = 'commander'");
    const [[{ clics_chatboard }]] = await db.query("SELECT COUNT(*) AS clics_chatboard FROM stats_clics WHERE type = 'chatboard'");
    const [[{ commandes_today }]] = await db.query("SELECT COUNT(*) AS commandes_today FROM commandes WHERE DATE(created_at) = CURDATE()");
    const [[{ commandes_month }]] = await db.query("SELECT COUNT(*) AS commandes_month FROM commandes WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())");
    const [[{ ca_month }]] = await db.query("SELECT COALESCE(SUM(prix * quantite), 0) AS ca_month FROM commandes WHERE MONTH(created_at) = MONTH(CURDATE())");
    const [visites7j] = await db.query(
      `SELECT DATE(created_at) AS jour, COUNT(DISTINCT session_id) AS total
       FROM stats_visites WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       GROUP BY jour ORDER BY jour ASC`
    );
    const [commandes7j] = await db.query(
      `SELECT DATE(created_at) AS jour, COUNT(*) AS total
       FROM commandes WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       GROUP BY jour ORDER BY jour ASC`
    );
    res.json({ visiteurs, clics_commander, clics_chatboard, commandes_today, commandes_month, ca_month, visites7j, commandes7j });
  } catch (err) {
    console.error("GET /stats/dashboard error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
