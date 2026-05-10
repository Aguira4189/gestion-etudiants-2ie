const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email et mot de passe requis' });

  try {
    const [rows] = await db.execute('SELECT * FROM utilisateurs WHERE email = ?', [email]);
    if (rows.length === 0)
      return res.status(401).json({ message: 'Identifiants incorrects' });

    const utilisateur = rows[0];
    const match = await bcrypt.compare(password, utilisateur.password);
    if (!match)
      return res.status(401).json({ message: 'Identifiants incorrects' });

    const token = jwt.sign(
      { id: utilisateur.id, email: utilisateur.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      token,
      utilisateur: { id: utilisateur.id, nom: utilisateur.nom, email: utilisateur.email }
    });
 } catch (err) {
    console.log('ERREUR LOGIN:', err.message);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

module.exports = router;