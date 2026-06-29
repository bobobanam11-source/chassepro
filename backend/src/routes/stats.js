const router = require("express").Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

// POST tracker une visite (public)
router.post("/visite", async (req, res) => {
  const { session_id, page } = req.body;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  await db.query("INSERT INTO stats_visites (session_id, ip, page) VALUES (?,?,?)", [session_id, ip, page]);
  res.json({ success: true });
});

// POST tracker clic chatboard (public)
router.post("/chatboard", async (req, res) => {
  await db.query("INSERT INTO stats_clics (type, produit_id) VALUES ('chatboard', NULL)");
  res.json({ success: true });
});

// GET dashboard stats (admin)
router.get("/dashboard", auth, async (req, res) => {
  const [[{ visiteurs }]] = await db.query("SELECT COUNT(DISTINCT session_id) AS visiteurs FROM stats_visites");
  const [[{ clics_commander }]] = await db.query("SELECT COUNT(*) AS clics_commander FROM stats_clics WHERE type = 'commander'");
  const [[{ clics_chatboard }]] = await db.query("SELECT COUNT(*) AS clics_chatboard FROM stats_clics WHERE type = 'chatboard'");
  const [[{ commandes_today }]] = await db.query("SELECT COUNT(*) AS commandes_today FROM commandes WHERE DATE(created_at) = CURDATE()");
  const [[{ commandes_month }]] = await db.query("SELECT COUNT(*) AS commandes_month FROM commandes WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())");
  const [[{ ca_month }]] = await db.query("SELECT COALESCE(SUM(prix * quantite), 0) AS ca_month FROM commandes WHERE MONTH(created_at) = MONTH(CURDATE())");

  // Visites 7 derniers jours
  const [visites7j] = await db.query(
    `SELECT DATE(created_at) AS jour, COUNT(DISTINCT session_id) AS total
     FROM stats_visites WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
     GROUP BY jour ORDER BY jour ASC`
  );

  // Commandes 7 derniers jours
  const [commandes7j] = await db.query(
    `SELECT DATE(created_at) AS jour, COUNT(*) AS total
     FROM commandes WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
     GROUP BY jour ORDER BY jour ASC`
  );

  res.json({ visiteurs, clics_commander, clics_chatboard, commandes_today, commandes_month, ca_month, visites7j, commandes7j });
});

module.exports = router;
