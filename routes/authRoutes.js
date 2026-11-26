const express = require('express');
const router = express.Router();

// Rutas públicas de autenticación (se conectarán al controlador en el inciso d)
router.post('/register', (req, res) => {
  res.json({ mensaje: 'Ruta de registro lista' });
});

router.post('/login', (req, res) => {
  res.json({ mensaje: 'Ruta de inicio de sesión lista' });
});

router.post('/logout', (req, res) => {
  res.json({ mensaje: 'Ruta de cierre de sesión lista' });
});

module.exports = router;