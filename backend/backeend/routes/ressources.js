const express = require('express');
const db = require('../config/db');
const auth = require('../middlewares/auth');

// ========== ÉCOLES ==========
const ecolesRouter = express.Router();
ecolesRouter.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM ecoles ORDER BY libelle');
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});
ecolesRouter.post('/', auth, async (req, res) => {
  try {
    const { libelle, adresse, telephone, email } = req.body;
    const [r] = await db.execute(
      'INSERT INTO ecoles (libelle, adresse, telephone, email) VALUES (?,?,?,?)',
      [libelle, adresse || null, telephone || null, email || null]
    );
    res.status(201).json({ id: r.insertId, libelle, adresse, telephone, email });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
ecolesRouter.put('/:id', auth, async (req, res) => {
  try {
    const { libelle, adresse, telephone, email } = req.body;
    await db.execute(
      'UPDATE ecoles SET libelle=?, adresse=?, telephone=?, email=? WHERE id=?',
      [libelle, adresse || null, telephone || null, email || null, req.params.id]
    );
    res.json({ message: 'Mise à jour réussie' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
ecolesRouter.delete('/:id', auth, async (req, res) => {
  try {
    await db.execute('DELETE FROM ecoles WHERE id=?', [req.params.id]);
    res.json({ message: 'Suppression réussie' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ========== FILIÈRES ==========
const filieresRouter = express.Router();
filieresRouter.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM filieres ORDER BY libelle');
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});
filieresRouter.post('/', auth, async (req, res) => {
  try {
    const { code, libelle, description } = req.body;
    const [r] = await db.execute(
      'INSERT INTO filieres (code, libelle, description) VALUES (?,?,?)',
      [code || null, libelle, description || null]
    );
    res.status(201).json({ id: r.insertId, code, libelle, description });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
filieresRouter.put('/:id', auth, async (req, res) => {
  try {
    const { code, libelle, description } = req.body;
    await db.execute(
      'UPDATE filieres SET code=?, libelle=?, description=? WHERE id=?',
      [code || null, libelle, description || null, req.params.id]
    );
    res.json({ message: 'Mise à jour réussie' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
filieresRouter.delete('/:id', auth, async (req, res) => {
  try {
    await db.execute('DELETE FROM filieres WHERE id=?', [req.params.id]);
    res.json({ message: 'Suppression réussie' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ========== SPÉCIALITÉS ==========
const specialitesRouter = express.Router();
specialitesRouter.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT s.*, f.libelle as filiere_libelle 
      FROM specialites s 
      JOIN filieres f ON s.filieres_id = f.id 
      ORDER BY s.libelle`);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});
specialitesRouter.post('/', auth, async (req, res) => {
  try {
    const { libelle, filieres_id, description } = req.body;
    const [r] = await db.execute(
      'INSERT INTO specialites (libelle, filieres_id, description) VALUES (?,?,?)',
      [libelle, filieres_id, description || null]
    );
    res.status(201).json({ id: r.insertId, libelle, filieres_id, description });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
specialitesRouter.put('/:id', auth, async (req, res) => {
  try {
    const { libelle, filieres_id, description } = req.body;
    await db.execute(
      'UPDATE specialites SET libelle=?, filieres_id=?, description=? WHERE id=?',
      [libelle, filieres_id, description || null, req.params.id]
    );
    res.json({ message: 'Mise à jour réussie' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
specialitesRouter.delete('/:id', auth, async (req, res) => {
  try {
    await db.execute('DELETE FROM specialites WHERE id=?', [req.params.id]);
    res.json({ message: 'Suppression réussie' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ========== CYCLES ==========
const cyclesRouter = express.Router();
cyclesRouter.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM cycles ORDER BY libelle');
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});
cyclesRouter.post('/', auth, async (req, res) => {
  try {
    const { libelle, duree_annees } = req.body;
    const [r] = await db.execute(
      'INSERT INTO cycles (libelle, duree_annees) VALUES (?,?)',
      [libelle, duree_annees || 3]
    );
    res.status(201).json({ id: r.insertId, libelle, duree_annees });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
cyclesRouter.put('/:id', auth, async (req, res) => {
  try {
    const { libelle, duree_annees } = req.body;
    await db.execute(
      'UPDATE cycles SET libelle=?, duree_annees=? WHERE id=?',
      [libelle, duree_annees, req.params.id]
    );
    res.json({ message: 'Mise à jour réussie' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
cyclesRouter.delete('/:id', auth, async (req, res) => {
  try {
    await db.execute('DELETE FROM cycles WHERE id=?', [req.params.id]);
    res.json({ message: 'Suppression réussie' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ========== NIVEAUX ==========
const niveauxRouter = express.Router();
niveauxRouter.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM niveaux ORDER BY ordre');
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});
niveauxRouter.post('/', auth, async (req, res) => {
  try {
    const { libelle, ordre } = req.body;
    const [r] = await db.execute(
      'INSERT INTO niveaux (libelle, ordre) VALUES (?,?)',
      [libelle, ordre || 1]
    );
    res.status(201).json({ id: r.insertId, libelle, ordre });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
niveauxRouter.put('/:id', auth, async (req, res) => {
  try {
    const { libelle, ordre } = req.body;
    await db.execute(
      'UPDATE niveaux SET libelle=?, ordre=? WHERE id=?',
      [libelle, ordre, req.params.id]
    );
    res.json({ message: 'Mise à jour réussie' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
niveauxRouter.delete('/:id', auth, async (req, res) => {
  try {
    await db.execute('DELETE FROM niveaux WHERE id=?', [req.params.id]);
    res.json({ message: 'Suppression réussie' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ========== PARCOURS ==========
const parcoursRouter = express.Router();
parcoursRouter.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT p.*, s.libelle as specialite_libelle, n.libelle as niveau_libelle, c.libelle as cycle_libelle
      FROM parcours p
      JOIN specialites s ON p.specialites_id = s.id
      JOIN niveaux n ON p.niveaux_id = n.id
      LEFT JOIN cycles c ON p.cycles_id = c.id
      ORDER BY p.libelle`);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});
parcoursRouter.post('/', auth, async (req, res) => {
  try {
    const { libelle, specialites_id, niveaux_id, cycles_id } = req.body;
    const [r] = await db.execute(
      'INSERT INTO parcours (libelle, specialites_id, niveaux_id, cycles_id) VALUES (?,?,?,?)',
      [libelle, specialites_id, niveaux_id, cycles_id || null]
    );
    res.status(201).json({ id: r.insertId, libelle, specialites_id, niveaux_id, cycles_id });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
parcoursRouter.put('/:id', auth, async (req, res) => {
  try {
    const { libelle, specialites_id, niveaux_id, cycles_id } = req.body;
    await db.execute(
      'UPDATE parcours SET libelle=?, specialites_id=?, niveaux_id=?, cycles_id=? WHERE id=?',
      [libelle, specialites_id, niveaux_id, cycles_id || null, req.params.id]
    );
    res.json({ message: 'Mise à jour réussie' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
parcoursRouter.delete('/:id', auth, async (req, res) => {
  try {
    await db.execute('DELETE FROM parcours WHERE id=?', [req.params.id]);
    res.json({ message: 'Suppression réussie' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ========== PAYS ==========
const paysRouter = express.Router();
paysRouter.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM pays ORDER BY libelle');
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ========== ÉTUDIANTS ==========
const etudiantsRouter = express.Router();
etudiantsRouter.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT e.*, p.libelle as pays_libelle, c.libelle as civilite_libelle
      FROM etudiants e 
      LEFT JOIN pays p ON e.pays_id = p.id
      LEFT JOIN civilites c ON e.civilites_id = c.id
      ORDER BY e.nom, e.prenoms`);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});
etudiantsRouter.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT e.*, p.libelle as pays_libelle, c.libelle as civilite_libelle
      FROM etudiants e 
      LEFT JOIN pays p ON e.pays_id = p.id
      LEFT JOIN civilites c ON e.civilites_id = c.id
      WHERE e.id=?`, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Étudiant non trouvé' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});
etudiantsRouter.post('/', auth, async (req, res) => {
  try {
    const { nom, prenoms, pays_id, civilites_id, dateNaissance, email, telephone } = req.body;
    const [r] = await db.execute(
      'INSERT INTO etudiants (nom, prenoms, pays_id, civilites_id, dateNaissance, email, telephone) VALUES (?,?,?,?,?,?,?)',
      [nom, prenoms, pays_id, civilites_id, dateNaissance || null, email || null, telephone || null]
    );
    res.status(201).json({ id: r.insertId, ...req.body });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
etudiantsRouter.put('/:id', auth, async (req, res) => {
  try {
    const { nom, prenoms, pays_id, civilites_id, dateNaissance, email, telephone } = req.body;
    await db.execute(
      'UPDATE etudiants SET nom=?, prenoms=?, pays_id=?, civilites_id=?, dateNaissance=?, email=?, telephone=? WHERE id=?',
      [nom, prenoms, pays_id, civilites_id, dateNaissance || null, email || null, telephone || null, req.params.id]
    );
    res.json({ message: 'Mise à jour réussie' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
etudiantsRouter.delete('/:id', auth, async (req, res) => {
  try {
    await db.execute('DELETE FROM etudiants WHERE id=?', [req.params.id]);
    res.json({ message: 'Suppression réussie' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
// ========== CIVILITÉS ==========
const civilitesRouter = express.Router();
civilitesRouter.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM civilites ORDER BY libelle');
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});
module.exports = { ecolesRouter, filieresRouter, specialitesRouter, cyclesRouter, niveauxRouter, parcoursRouter, paysRouter, etudiantsRouter, civilitesRouter };