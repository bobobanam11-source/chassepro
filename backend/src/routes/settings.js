const router = require("express").Router();
const db = require("../config/db");
const auth = require("../middleware/auth");
const multer = require("multer");
const { uploadToCloudinary } = require("../config/cloudinary");
const upload = multer({ storage: multer.memoryStorage() });

// GET tous les settings (public)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT `key`, value FROM settings");
    const settings = {};
    rows.forEach((r) => (settings[r.key] = r.value));
    res.json(settings);
  } catch (err) {
    console.error("GET /settings error:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT modifier un setting (admin)
router.put("/:key", auth, async (req, res) => {
  try {
    const { value } = req.body;
    await db.query("UPDATE settings SET value = ? WHERE `key` = ?", [value, req.params.key]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT upload logo (admin)
router.put("/logo/upload", auth, upload.single("logo"), async (req, res) => {
  try {
    const url = await uploadToCloudinary(req.file);
    await db.query("UPDATE settings SET value = ? WHERE `key` = 'logo_url'", [url]);
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
