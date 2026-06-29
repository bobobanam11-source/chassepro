const router = require("express").Router();
const db = require("../config/db");
const auth = require("../middleware/auth");
const multer = require("multer");
const { uploadToCloudinary } = require("../config/cloudinary");
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM marques");
  res.json(rows);
});

router.post("/", auth, upload.single("logo"), async (req, res) => {
  const { nom, description } = req.body;
  let logo_url = null;
  if (req.file) logo_url = await uploadToCloudinary(req.file);
  const [r] = await db.query("INSERT INTO marques (nom, logo_url, description) VALUES (?,?,?)", [nom, logo_url, description]);
  res.status(201).json({ id: r.insertId });
});

router.put("/:id", auth, upload.single("logo"), async (req, res) => {
  const { nom, description } = req.body;
  let logo_url;
  if (req.file) logo_url = await uploadToCloudinary(req.file);
  await db.query(
    `UPDATE marques SET nom=?, description=? ${logo_url ? ", logo_url=?" : ""} WHERE id=?`,
    logo_url ? [nom, description, logo_url, req.params.id] : [nom, description, req.params.id]
  );
  res.json({ success: true });
});

router.delete("/:id", auth, async (req, res) => {
  await db.query("DELETE FROM marques WHERE id = ?", [req.params.id]);
  res.json({ success: true });
});

module.exports = router;
