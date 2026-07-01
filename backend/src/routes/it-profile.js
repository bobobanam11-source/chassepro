const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// Middleware auth IT admin
const itAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token manquant" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== "it_admin") return res.status(403).json({ error: "Accès IT requis" });
    req.itAdmin = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Token invalide" });
  }
};

// Changer mot de passe IT admin
router.put("/change-password", itAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const [[itAdmin]] = await db.query("SELECT password_hash FROM it_admins WHERE id = ?", [req.itAdmin.id]);
    if (!itAdmin) return res.status(404).json({ error: "IT Admin introuvable" });
    const validCurrent = await bcrypt.compare(currentPassword, itAdmin.password_hash);
    if (!validCurrent) return res.status(400).json({ error: "Mot de passe actuel incorrect" });
    const newHash = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE it_admins SET password_hash = ? WHERE id = ?", [newHash, req.itAdmin.id]);
    res.json({ success: true, message: "Mot de passe modifié avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;