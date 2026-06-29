const router = require("express").Router();
const db = require("../config/db");
const auth = require("../middleware/auth");
const multer = require("multer");
const { uploadToCloudinary } = require("../config/cloudinary");
const upload = multer({ storage: multer.memoryStorage() });

// GET (public)
router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM categories ORDER BY ordre ASC");
  res.json(rows);
});

// POST (admin)
router.post("/", auth, upload.single("photo"), async (req, res) => {
  const { nom, description, emoji, ordre } = req.body;
  let photo_url = null;
  if (req.file) photo_url = await uploadToCloudinary(req.file);
  const [r] = await db.query("INSERT INTO categories (nom, description, emoji, photo_url, ordre) VALUES (?,?,?,?,?)", [nom, description, emoji, photo_url, ordre || 0]);
  res.status(201).json({ id: r.insertId });
});

// PUT (admin)
router.put("/:id", auth, upload.single("photo"), async (req, res) => {
  const { nom, description, emoji, ordre } = req.body;
  let photo_url;
  if (req.file) photo_url = await uploadToCloudinary(req.file);
  await db.query(
    `UPDATE categories SET nom=?, description=?, emoji=?, ordre=? ${photo_url ? ", photo_url=?" : ""} WHERE id=?`,
    photo_url ? [nom, description, emoji, ordre, photo_url, req.params.id] : [nom, description, emoji, ordre, req.params.id]
  );
  res.json({ success: true });
});

// DELETE (admin)
router.delete("/:id", auth, async (req, res) => {
  await db.query("DELETE FROM categories WHERE id = ?", [req.params.id]);
  res.json({ success: true });
});

module.exports = router;
