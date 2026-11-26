const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Registro de usuario
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
    }

    const usuarioExistente = await Usuario.findOne({ $or: [{ email }, { username }] });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El usuario o correo ya está registrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordEncriptado = await bcrypt.hash(password, salt);

    const nuevoUsuario = new Usuario({
      username,
      email,
      password: passwordEncriptado
    });

    await nuevoUsuario.save();
    res.status(201).json({ mensaje: 'Usuario registrado exitosamente.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar usuario.', error: error.message });
  }
};

// Inicio de sesión (Login)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas.' });
    }

    const esValido = await bcrypt.compare(password, usuario.password);
    if (!esValido) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas.' });
    }

    const token = jwt.sign(
      { id: usuario._id, username: usuario.username },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      mensaje: 'Inicio de sesión exitoso.',
      token,
      usuario: { id: usuario._id, username: usuario.username, email: usuario.email }
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al iniciar sesión.', error: error.message });
  }
};

// Cierre de sesión (Logout)
exports.logout = (req, res) => {
  res.json({ mensaje: 'Sesión cerrada correctamente.' });
};
