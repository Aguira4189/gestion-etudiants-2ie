require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const { 
  ecolesRouter, filieresRouter, specialitesRouter,
  cyclesRouter, niveauxRouter, parcoursRouter,
  paysRouter, etudiantsRouter, civilitesRouter
} = require('./routes/ressources');

app.use('/api/auth', authRoutes);
app.use('/api/ecoles', ecolesRouter);
app.use('/api/filieres', filieresRouter);
app.use('/api/specialites', specialitesRouter);
app.use('/api/cycles', cyclesRouter);
app.use('/api/niveaux', niveauxRouter);
app.use('/api/parcours', parcoursRouter);
app.use('/api/pays', paysRouter);
app.use('/api/etudiants', etudiantsRouter);
app.use('/api/civilites', civilitesRouter);

app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'API 2iE opérationnelle' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));