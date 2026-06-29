const router = require("express").Router();
const db = require("../config/db");
const auth = require("../middleware/auth");
const multer = require("multer");
const { uploadToCloudinary } = require("../config/cloudinary");
const upload = multer({ storage: multer.memoryStorage() });

// GET tous les produits actifs (public)
router.get("/", async (req, res) => {
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
    p.tailles = tailles;
    p.couleurs = couleurs;
  }
  res.json(produits);
});

// GET un produit (public)
router.get("/:id", async (req, res) => {
  const [[p]] = await db.query(`SELECT p.*, c.nom AS categorie_nom, m.nom AS marque_nom
    FROM produits p LEFT JOIN categories c ON p.categorie_id = c.id
    LEFT JOIN marques m ON p.marque_id = m.id WHERE p.id = ?`, [req.params.id]);
  if (!p) return res.status(404).json({ error: "Produit introuvable" });
  const [tailles] = await db.query("SELECT * FROM produit_tailles WHERE produit_id = ?", [p.id]);
  const [couleurs] = await db.query("SELECT * FROM produit_couleurs WHERE produit_id = ?", [p.id]);
  p.tailles = tailles;
  p.couleurs = couleurs;
  res.json(p);
});

// POST créer produit (admin)
router.post("/", auth, upload.single("image"), async (req, res) => {
  const { nom, description, prix, prix_barre, marque_id, categorie_id, badge, note, nb_avis, emoji, couleur_fond, tailles, couleurs } = req.body;
  let image_url = null;
  if (req.file) image_url = await uploadToCloudinary(req.file);
  const [result] = await db.query(
    "INSERT INTO produits (nom, description, prix, prix_barre, marque_id, categorie_id, badge, note, nb_avis, emoji, couleur_fond, image_url) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
    [nom, description, prix, prix_barre || null, marque_id || null, categorie_id || null, badge || null, note || 0, nb_avis || 0, emoji, couleur_fond, image_url]
  );
  const produitId = result.insertId;
  if (tailles) {
    const t = JSON.parse(tailles);
    await db.query("INSERT INTO produit_tailles (produit_id, type_taille, valeurs) VALUES (?,?,?)", [produitId, t.type, JSON.stringify(t.valeurs)]);
  }
  if (couleurs) {
    const cols = JSON.parse(couleurs);
    for (const c of cols) await db.query("INSERT INTO produit_couleurs (produit_id, nom, code_hex) VALUES (?,?,?)", [produitId, c.nom, c.code_hex]);
  }
  res.status(201).json({ id: produitId });
});

// PUT modifier produit (admin)
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  const { nom, description, prix, prix_barre, marque_id, categorie_id, badge, note, nb_avis, emoji, couleur_fond, actif, tailles, couleurs } = req.body;
  let image_url;
  if (req.file) image_url = await uploadToCloudinary(req.file);
  await db.query(
    `UPDATE produits SET nom=?, description=?, prix=?, prix_barre=?, marque_id=?, categorie_id=?, badge=?, note=?, nb_avis=?, emoji=?, couleur_fond=?, actif=? ${image_url ? ", image_url=?" : ""} WHERE id=?`,
    image_url
      ? [nom, description, prix, prix_barre || null, marque_id || null, categorie_id || null, badge || null, note, nb_avis, emoji, couleur_fond, actif, image_url, req.params.id]
      : [nom, description, prix, prix_barre || null, marque_id || null, categorie_id || null, badge || null, note, nb_avis, emoji, couleur_fond, actif, req.params.id]
  );
  if (tailles) {
    const t = JSON.parse(tailles);
    await db.query("DELETE FROM produit_tailles WHERE produit_id = ?", [req.params.id]);
    await db.query("INSERT INTO produit_tailles (produit_id, type_taille, valeurs) VALUES (?,?,?)", [req.params.id, t.type, JSON.stringify(t.valeurs)]);
  }
  if (couleurs) {
    const cols = JSON.parse(couleurs);
    await db.query("DELETE FROM produit_couleurs WHERE produit_id = ?", [req.params.id]);
    for (const c of cols) await db.query("INSERT INTO produit_couleurs (produit_id, nom, code_hex) VALUES (?,?,?)", [req.params.id, c.nom, c.code_hex]);
  }
  res.json({ success: true });
});

// DELETE supprimer produit (admin)
router.delete("/:id", auth, async (req, res) => {
  await db.query("DELETE FROM produits WHERE id = ?", [req.params.id]);
  res.json({ success: true });
});

module.exports = router;
