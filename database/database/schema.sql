-- ============================================================
-- BASE DE DONNÉES : Gestion des étudiants 2iE
-- ============================================================

CREATE DATABASE IF NOT EXISTS gestion_etudiants_2ie CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gestion_etudiants_2ie;

-- Table des utilisateurs (authentification)
CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role ENUM('admin', 'gestionnaire') DEFAULT 'gestionnaire',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des pays
CREATE TABLE pays (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(5) UNIQUE NOT NULL,
    libelle VARCHAR(100) NOT NULL
);

-- Table des écoles
CREATE TABLE ecoles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    libelle VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des filières
CREATE TABLE filieres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    libelle VARCHAR(150) NOT NULL,
    ecole_id INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ecole_id) REFERENCES ecoles(id) ON DELETE CASCADE
);

-- Table des spécialités
CREATE TABLE specialites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    libelle VARCHAR(150) NOT NULL,
    filiere_id INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (filiere_id) REFERENCES filieres(id) ON DELETE CASCADE
);

-- Table des cycles
CREATE TABLE cycles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    libelle VARCHAR(100) NOT NULL,
    duree_annees INT NOT NULL DEFAULT 3
);

-- Table des niveaux
CREATE TABLE niveaux (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    libelle VARCHAR(100) NOT NULL,
    cycle_id INT NOT NULL,
    FOREIGN KEY (cycle_id) REFERENCES cycles(id) ON DELETE CASCADE
);

-- Table des parcours
CREATE TABLE parcours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    libelle VARCHAR(150) NOT NULL,
    specialite_id INT NOT NULL,
    niveau_id INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (specialite_id) REFERENCES specialites(id) ON DELETE CASCADE,
    FOREIGN KEY (niveau_id) REFERENCES niveaux(id) ON DELETE CASCADE
);

-- Table des années académiques
CREATE TABLE annees_academiques (
    id INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(20) NOT NULL,   -- ex: "2025-2026"
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    active BOOLEAN DEFAULT FALSE
);

-- Table des classes
CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    libelle VARCHAR(100) NOT NULL,
    parcours_id INT NOT NULL,
    annee_academique_id INT NOT NULL,
    capacite INT DEFAULT 50,
    FOREIGN KEY (parcours_id) REFERENCES parcours(id),
    FOREIGN KEY (annee_academique_id) REFERENCES annees_academiques(id)
);

-- Table des étudiants
CREATE TABLE etudiants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matricule VARCHAR(30) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenoms VARCHAR(150) NOT NULL,
    date_naissance DATE NOT NULL,
    lieu_naissance VARCHAR(150),
    sexe ENUM('M', 'F') NOT NULL,
    pays_id INT,
    email VARCHAR(150) UNIQUE,
    telephone VARCHAR(20),
    adresse TEXT,
    photo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pays_id) REFERENCES pays(id)
);

-- Table des inscriptions
CREATE TABLE inscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    etudiant_id INT NOT NULL,
    classe_id INT NOT NULL,
    annee_academique_id INT NOT NULL,
    date_inscription DATE NOT NULL DEFAULT (CURDATE()),
    statut ENUM('actif', 'suspendu', 'diplome', 'abandonne') DEFAULT 'actif',
    numero_inscription VARCHAR(30) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (etudiant_id) REFERENCES etudiants(id),
    FOREIGN KEY (classe_id) REFERENCES classes(id),
    FOREIGN KEY (annee_academique_id) REFERENCES annees_academiques(id)
);

-- ============================================================
-- DONNÉES INITIALES
-- ============================================================

-- Utilisateur admin par défaut (mot de passe: Admin@2iE)
INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES
('Administrateur', 'admin@2ie-edu.org', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Pays
INSERT INTO pays (code, libelle) VALUES
('BF', 'Burkina Faso'), ('CI', "Côte d'Ivoire"), ('ML', 'Mali'),
('SN', 'Sénégal'), ('GN', 'Guinée'), ('TG', 'Togo'),
('BJ', 'Bénin'), ('NE', 'Niger'), ('CM', 'Cameroun'), ('GA', 'Gabon');

-- Cycles
INSERT INTO cycles (code, libelle, duree_annees) VALUES
('LIC', 'Licence', 3), ('MASTER', 'Master', 2), ('ING', 'Ingénieur', 5), ('DOCTORAT', 'Doctorat', 3);

-- Niveaux
INSERT INTO niveaux (code, libelle, cycle_id) VALUES
('L1', 'Licence 1', 1), ('L2', 'Licence 2', 1), ('L3', 'Licence 3', 1),
('M1', 'Master 1', 2), ('M2', 'Master 2', 2),
('ING1', 'Ingénieur 1', 3), ('ING2', 'Ingénieur 2', 3), ('ING3', 'Ingénieur 3', 3);

-- Année académique
INSERT INTO annees_academiques (libelle, date_debut, date_fin, active) VALUES
('2025-2026', '2025-10-01', '2026-07-31', TRUE),
('2024-2025', '2024-10-01', '2025-07-31', FALSE);
