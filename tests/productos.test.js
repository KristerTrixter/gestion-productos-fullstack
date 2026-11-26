const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
const Producto = require('../models/Producto');

jest.mock('../models/Producto');

describe('Pruebas de Rutas y Controladores de Productos', () => {
  let token;

  beforeAll(() => {
    process.env.JWT_SECRET = 'clave_secreta_de_prueba';
    token = jwt.sign({ id: '12345', username: 'testuser' }, process.env.JWT_SECRET);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/productos debe rechazar peticiones sin token (401)', async () => {
    const res = await request(app).get('/api/productos');
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/productos debe devolver lista de productos con token válido (200)', async () => {
    const productosMock = [
      { _id: '1', nombre: 'Laptop', precio: 15000, stock: 5 }
    ];

    Producto.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue(productosMock)
    });

    const res = await request(app)
      .get('/api/productos')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].nombre).toBe('Laptop');
  });

  test('POST /api/productos debe fallar si falta nombre o precio (400)', async () => {
    const res = await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${token}`)
      .send({ descripcion: 'Sin nombre ni precio' });

    expect(res.statusCode).toBe(400);
    expect(res.body.mensaje).toBe('El nombre y el precio son obligatorios.');
  });

  test('POST /api/productos debe crear un producto con token válido (201)', async () => {
    const nuevoProducto = { nombre: 'Mouse', precio: 500, stock: 20 };

    Producto.prototype.save = jest.fn().mockResolvedValue({
      _id: '2',
      ...nuevoProducto
    });

    const res = await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${token}`)
      .send(nuevoProducto);

    expect(res.statusCode).toBe(201);
    expect(res.body.nombre).toBe('Mouse');
  });

  test('PUT /api/productos/:id debe actualizar un producto existente (200)', async () => {
    const actualizado = { _id: '2', nombre: 'Mouse Gamer', precio: 750 };
    Producto.findByIdAndUpdate.mockResolvedValue(actualizado);

    const res = await request(app)
      .put('/api/productos/2')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Mouse Gamer', precio: 750 });

    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe('Mouse Gamer');
  });

  test('DELETE /api/productos/:id debe devolver 404 si el producto no existe', async () => {
    Producto.findByIdAndDelete.mockResolvedValue(null);

    const res = await request(app)
      .delete('/api/productos/999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

  test('DELETE /api/productos/:id debe eliminar un producto existente (200)', async () => {
    Producto.findByIdAndDelete.mockResolvedValue({ _id: '2', nombre: 'Mouse' });

    const res = await request(app)
      .delete('/api/productos/2')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.mensaje).toBe('Producto eliminado correctamente.');
  });
});
