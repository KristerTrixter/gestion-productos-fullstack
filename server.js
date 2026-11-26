require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const productoRoutes = require('./routes/productoRoutes');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta de prueba
app.get('/api/status', (req, res) => {
  res.json({ mensaje: 'Servidor funcionando correctamente' });
});

// Middlewares de rutas de recursos
app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);

// Iniciar servidor solo si se ejecuta directamente (no en pruebas con Jest)
if (require.main === module) {
  connectDB();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;