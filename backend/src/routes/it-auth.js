const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// Login IT Admin
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query("SELECT * FROM it_admins WHERE email = ?", [email]);
    if (!rows.length) return res.status(401).json({ error: "Identifiants invalides" });
    const valid = await bcrypt.compare(password, rows[0].password_hash);
    if (!valid) return res.status(401).json({ error: "Identifiants invalides" });
    const token = jwt.sign({ id: rows[0].id, email: rows[0].email, type: "it_admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch (err) {
    console.error("POST /it-auth/login error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;