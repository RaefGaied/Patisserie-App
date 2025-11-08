const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');

// Exemple de route admin protégée
router.get('/dashboard', protect, admin, (req, res) => {
  res.json({ message: 'Bienvenue dans le dashboard admin !' });
});

module.exports = router;
