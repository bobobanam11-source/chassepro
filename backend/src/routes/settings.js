const router = require("express").Router();
const db = require("../config/db");
const auth = require("../middleware/auth");
const multer = require("multer");
const { uploadToCloudinary } = require("../config/cloudinary");
const upload = multer({ storage: multer.memoryStorage() });

// GET tous les settings (public)
router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT `key`, value FROM settings");
  const settings = {};
  rows.forEach((r) => (settings[r.key] = r.value));
  res.json(settings);
});

// PUT modifier un setting (admin)
router.put("/:key", auth, async (req, res) => {
  const { value } = req.body;
  await db.query("UPDATE settings SET value = ? WHERE `key` = ?", [value, req.params.key]);
  res.json({ success: true });
});

// PUT upload logo (admin)
router.put("/logo/upload", auth, upload.single("logo"), async (req, res) => {
  const url = await uploadToCloudinary(req.file);
  await db.query("UPDATE settings SET value = ? WHERE `key` = 'logo_url'", [url]);
  res.json({ url });
});

module.exports = router;
