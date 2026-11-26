const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Middleware de protección para todas las rutas de productos
router.use(authMiddleware);

// Rutas CRUD de productos (se conectarán al controlador en el inciso e)
router.get('/', (req, res) => {
  res.json({ mensaje: 'Obtener todos los productos' });
});

router.get('/:id', (req, res) => {
  res.json({ mensaje: `Obtener producto ${req.params.id}` });
});

router.post('/', (req, res) => {
  res.json({ mensaje: 'Crear nuevo producto' });
});

router.put('/:id', (req, res) => {
  res.json({ mensaje: `Actualizar producto ${req.params.id}` });
});

router.delete('/:id', (req, res) => {
  res.json({ mensaje: `Eliminar producto ${req.params.id}` });
});

module.exports = router;
