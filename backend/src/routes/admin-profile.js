const router = require("express").Router();
const bcrypt = require("bcryptjs");
const db = require("../config/db");
const auth = require("../middleware/auth");

// Changer mot de passe admin normal
router.put("/change-password", auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  // Vérifier mot de passe actuel
  const [[admin]] = await db.query("SELECT password_hash FROM admins WHERE id = ?", [req.admin.id]);
  if (!admin) return res.status(404).json({ error: "Admin introuvable" });
  
  const validCurrent = await bcrypt.compare(currentPassword, admin.password_hash);
  if (!validCurrent) return res.status(400).json({ error: "Mot de passe actuel incorrect" });
  
  // Hash nouveau mot de passe
  const newHash = await bcrypt.hash(newPassword, 10);
  
  // Mettre à jour
  await db.query("UPDATE admins SET password_hash = ? WHERE id = ?", [newHash, req.admin.id]);
  
  res.json({ success: true, message: "Mot de passe modifié avec succès" });
});

module.exports = router;