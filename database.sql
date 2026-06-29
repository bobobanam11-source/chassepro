-- ============================================
-- GARMINCHASSE — Script SQL complet (Aiven/MySQL)
-- ============================================

CREATE DATABASE IF NOT EXISTS garminchasse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE garminchasse;

-- Admins
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings (clé/valeur)
CREATE TABLE settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(100) NOT NULL UNIQUE,
  value TEXT
);

INSERT INTO settings (`key`, value) VALUES
('whatsapp_number', '33757754353'),
('site_actif', 'true'),
('site_nom', 'Garminchasse'),
('couleur_primaire', '#1B3A2D'),
('couleur_secondaire', '#E07B2A'),
('couleur_accent', '#F59E0B'),
('logo_url', '');

-- Catégories
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  description TEXT,
  emoji VARCHAR(10),
  photo_url VARCHAR(500),
  ordre INT DEFAULT 0
);

-- Marques
CREATE TABLE marques (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  logo_url VARCHAR(500),
  description TEXT
);

-- Produits
CREATE TABLE produits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  description TEXT,
  prix DECIMAL(10,2) NOT NULL,
  prix_barre DECIMAL(10,2),
  marque_id INT,
  categorie_id INT,
  badge ENUM('Nouveau','Promo','Bestseller') DEFAULT NULL,
  note DECIMAL(2,1) DEFAULT 0,
  nb_avis INT DEFAULT 0,
  emoji VARCHAR(10),
  couleur_fond VARCHAR(20),
  image_url VARCHAR(500),
  actif TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (marque_id) REFERENCES marques(id) ON DELETE SET NULL,
  FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Tailles par produit
CREATE TABLE produit_tailles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  produit_id INT NOT NULL,
  type_taille ENUM('alphanum','cm','unique','custom') NOT NULL,
  valeurs JSON,
  FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE
);

-- Couleurs par produit
CREATE TABLE produit_couleurs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  produit_id INT NOT NULL,
  nom VARCHAR(50),
  code_hex VARCHAR(10),
  FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE
);

-- Carousel
CREATE TABLE carousel (
  id INT AUTO_INCREMENT PRIMARY KEY,
  produit_id INT NOT NULL,
  ordre INT DEFAULT 0,
  FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE
);

-- Commandes WhatsApp
CREATE TABLE commandes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  produit_id INT,
  nom_produit VARCHAR(255),
  prix DECIMAL(10,2),
  taille VARCHAR(50),
  couleur VARCHAR(50),
  quantite INT DEFAULT 1,
  statut ENUM('en_attente','confirmee','expediee','livree','annulee') DEFAULT 'en_attente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE SET NULL
);

-- Stats visites
CREATE TABLE stats_visites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(100),
  ip VARCHAR(50),
  page VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stats clics
CREATE TABLE stats_clics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('commander','chatboard') NOT NULL,
  produit_id INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE SET NULL
);
