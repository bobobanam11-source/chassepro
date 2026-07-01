const router = require("express").Router();
const db = require("../config/db");
const auth = require("../middleware/auth");
const multer = require("multer");
const { uploadToCloudinary } = require("../config/cloudinary");
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM marques");
    res.json(rows);
  } catch (err) {
    console.error("GET /marques error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/", auth, upload.single("logo"), async (req, res) => {
  try {
    const { nom, description } = req.body;
    let logo_url = null;
    if (req.file) logo_url = await uploadToCloudinary(req.file);
    const [r] = await db.query("INSERT INTO marques (nom, logo_url, description) VALUES (?,?,?)", [nom, logo_url, description]);
    res.status(201).json({ id: r.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", auth, upload.single("logo"), async (req, res) => {
  try {
    const { nom, description } = req.body;
    let logo_url;
    if (req.file) logo_url = await uploadToCloudinary(req.file);
    await db.query(
      `UPDATE marques SET nom=?, description=? ${logo_url ? ", logo_url=?" : ""} WHERE id=?`,
      logo_url ? [nom, description, logo_url, req.params.id] : [nom, description, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    await db.query("DELETE FROM marques WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
