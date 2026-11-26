const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const productoController = require('../controllers/productoController');

// Proteger todas las rutas de productos con JWT
router.use(authMiddleware);

router.get('/', productoController.obtenerProductos);
router.get('/:id', productoController.obtenerProductoPorId);
router.post('/', productoController.crearProducto);
router.put('/:id', productoController.actualizarProducto);
router.delete('/:id', productoController.eliminarProducto);

module.exports = router;