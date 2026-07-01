const router = require("express").Router();
const db = require("../config/db");
const auth = require("../middleware/auth");
const multer = require("multer");
const { uploadToCloudinary } = require("../config/cloudinary");
const upload = multer({ storage: multer.memoryStorage() });

// GET tous les produits actifs (public)
router.get("/", async (req, res) => {
  try {
    const { categorie, marque, q } = req.query;
    let sql = `SELECT p.*, c.nom AS categorie_nom, m.nom AS marque_nom
               FROM produits p
               LEFT JOIN categories c ON p.categorie_id = c.id
               LEFT JOIN marques m ON p.marque_id = m.id
               WHERE p.actif = 1`;
    const params = [];
    if (categorie) { sql += " AND c.nom = ?"; params.push(categorie); }
    if (marque) { sql += " AND m.nom = ?"; params.push(marque); }
    if (q) { sql += " AND p.nom LIKE ?"; params.push(`%${q}%`); }
    const [produits] = await db.query(sql, params);
    for (const p of produits) {
      const [tailles] = await db.query("SELECT * FROM produit_tailles WHERE produit_id = ?", [p.id]);
      const [couleurs] = await db.query("SELECT * FROM produit_couleurs WHERE produit_id = ?", [p.id]);
      const [images] = await db.query("SELECT * FROM produit_images WHERE produit_id = ? ORDER BY ordre ASC", [p.id]);
      p.tailles = tailles;
      p.couleurs = couleurs;
      p.images = images;
    }
    res.json(produits);
  } catch (err) {
    console.error("GET /produits error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET un produit (public)
router.get("/:id", async (req, res) => {
  try {
    const [[p]] = await db.query(`SELECT p.*, c.nom AS categorie_nom, m.nom AS marque_nom
      FROM produits p LEFT JOIN categories c ON p.categorie_id = c.id
      LEFT JOIN marques m ON p.marque_id = m.id WHERE p.id = ?`, [req.params.id]);
    if (!p) return res.status(404).json({ error: "Produit introuvable" });
    const [tailles] = await db.query("SELECT * FROM produit_tailles WHERE produit_id = ?", [p.id]);
    const [couleurs] = await db.query("SELECT * FROM produit_couleurs WHERE produit_id = ?", [p.id]);
    const [images] = await db.query("SELECT * FROM produit_images WHERE produit_id = ? ORDER BY ordre ASC", [p.id]);
    p.tailles = tailles;
    p.couleurs = couleurs;
    p.images = images;
    res.json(p);
  } catch (err) {
    console.error("GET /produits/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST créer produit (admin) - support multi-images
router.post("/", auth, upload.fields([
  { name: "image", maxCount: 1 },
  { name: "images", maxCount: 10 },
  { name: "couleur_images", maxCount: 10 },
]), async (req, res) => {
  try {
    const { nom, description, prix, prix_barre, marque_id, categorie_id, badge, note, nb_avis, emoji, couleur_fond, tailles, couleurs } = req.body;
    let image_url = null;
    if (req.files?.image?.[0]) image_url = await uploadToCloudinary(req.files.image[0]);
    const [result] = await db.query(
      "INSERT INTO produits (nom, description, prix, prix_barre, marque_id, categorie_id, badge, note, nb_avis, emoji, couleur_fond, image_url) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
      [nom, description, prix, prix_barre || null, marque_id || null, categorie_id || null, badge || null, note || 0, nb_avis || 0, emoji || "", couleur_fond || "#f5f5f5", image_url]
    );
    const produitId = result.insertId;
    if (tailles) {
      const t = JSON.parse(tailles);
      await db.query("INSERT INTO produit_tailles (produit_id, type_taille, valeurs) VALUES (?,?,?)", [produitId, t.type, JSON.stringify(t.valeurs)]);
    }
    if (couleurs) {
      const cols = JSON.parse(couleurs);
      let imgIdx = 0;
      for (let i = 0; i < cols.length; i++) {
        let couleur_image_url = cols[i].image_url || null;
        if (!cols[i].image_url && req.files?.couleur_images?.[imgIdx]) {
          couleur_image_url = await uploadToCloudinary(req.files.couleur_images[imgIdx]);
          imgIdx++;
        }
        await db.query("INSERT INTO produit_couleurs (produit_id, nom, code_hex, image_url) VALUES (?,?,?,?)", [produitId, cols[i].nom, cols[i].code_hex, couleur_image_url]);
      }
    }
    if (req.files?.images) {
      for (let i = 0; i < req.files.images.length; i++) {
        const url = await uploadToCloudinary(req.files.images[i]);
        await db.query("INSERT INTO produit_images (produit_id, image_url, ordre) VALUES (?,?,?)", [produitId, url, i]);
      }
    }
    res.status(201).json({ id: produitId });
  } catch (err) {
    console.error("POST /produits error:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT modifier produit (admin)
router.put("/:id", auth, upload.fields([
  { name: "image", maxCount: 1 },
  { name: "images", maxCount: 10 },
  { name: "couleur_images", maxCount: 10 },
]), async (req, res) => {
  try {
    const { nom, description, prix, prix_barre, marque_id, categorie_id, badge, note, nb_avis, emoji, couleur_fond, actif, tailles, couleurs } = req.body;
    let image_url;
    if (req.files?.image?.[0]) image_url = await uploadToCloudinary(req.files.image[0]);
    await db.query(
      `UPDATE produits SET nom=?, description=?, prix=?, prix_barre=?, marque_id=?, categorie_id=?, badge=?, note=?, nb_avis=?, emoji=?, couleur_fond=?, actif=? ${image_url ? ", image_url=?" : ""} WHERE id=?`,
      image_url
        ? [nom, description, prix, prix_barre || null, marque_id || null, categorie_id || null, badge || null, note || 0, nb_avis || 0, emoji || "", couleur_fond, actif, image_url, req.params.id]
        : [nom, description, prix, prix_barre || null, marque_id || null, categorie_id || null, badge || null, note || 0, nb_avis || 0, emoji || "", couleur_fond, actif, req.params.id]
    );
    if (tailles) {
      const t = JSON.parse(tailles);
      await db.query("DELETE FROM produit_tailles WHERE produit_id = ?", [req.params.id]);
      await db.query("INSERT INTO produit_tailles (produit_id, type_taille, valeurs) VALUES (?,?,?)", [req.params.id, t.type, JSON.stringify(t.valeurs)]);
    }
    if (couleurs) {
      const cols = JSON.parse(couleurs);
      await db.query("DELETE FROM produit_couleurs WHERE produit_id = ?", [req.params.id]);
      let imgIdx = 0;
      for (let i = 0; i < cols.length; i++) {
        let couleur_image_url = cols[i].image_url || null;
        // On n'utilise une nouvelle image que si la couleur n'en a pas déjà une
        if (!cols[i].image_url && req.files?.couleur_images?.[imgIdx]) {
          couleur_image_url = await uploadToCloudinary(req.files.couleur_images[imgIdx]);
          imgIdx++;
        }
        await db.query("INSERT INTO produit_couleurs (produit_id, nom, code_hex, image_url) VALUES (?,?,?,?)", [req.params.id, cols[i].nom, cols[i].code_hex, couleur_image_url]);
      }
    }
    if (req.files?.images) {
      for (let i = 0; i < req.files.images.length; i++) {
        const url = await uploadToCloudinary(req.files.images[i]);
        await db.query("INSERT INTO produit_images (produit_id, image_url, ordre) VALUES (?,?,?)", [req.params.id, url, i]);
      }
    }
    res.json({ success: true });
  } catch (err) {
    console.error("PUT /produits/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE image supplémentaire
router.delete("/:id/images/:imageId", auth, async (req, res) => {
  try {
    await db.query("DELETE FROM produit_images WHERE id = ? AND produit_id = ?", [req.params.imageId, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE supprimer produit
router.delete("/:id", auth, async (req, res) => {
  try {
    await db.query("DELETE FROM produits WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
