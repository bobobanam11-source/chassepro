const router = require("express").Router();
const db = require("../config/db");
const auth = require("../middleware/auth");
const multer = require("multer");
const { uploadToCloudinary } = require("../config/cloudinary");
const upload = multer({ storage: multer.memoryStorage() });

// GET (public)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM categories ORDER BY ordre ASC");
    res.json(rows);
  } catch (err) {
    console.error("GET /categories error:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST (admin)
router.post("/", auth, upload.single("photo"), async (req, res) => {
  try {
    const { nom, description, emoji, ordre } = req.body;
    let photo_url = null;
    if (req.file) photo_url = await uploadToCloudinary(req.file);
    const [r] = await db.query("INSERT INTO categories (nom, description, emoji, photo_url, ordre) VALUES (?,?,?,?,?)", [nom, description, emoji, photo_url, ordre || 0]);
    res.status(201).json({ id: r.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT (admin)
router.put("/:id", auth, upload.single("photo"), async (req, res) => {
  try {
    const { nom, description, emoji, ordre } = req.body;
    let photo_url;
    if (req.file) photo_url = await uploadToCloudinary(req.file);
    await db.query(
      `UPDATE categories SET nom=?, description=?, emoji=?, ordre=? ${photo_url ? ", photo_url=?" : ""} WHERE id=?`,
      photo_url ? [nom, description, emoji, ordre, photo_url, req.params.id] : [nom, description, emoji, ordre, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE (admin)
router.delete("/:id", auth, async (req, res) => {
  try {
    await db.query("DELETE FROM categories WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
