const express = require('express');
const cors = require('cors');
const productosRoutes = require('./routes/productosRoutes');
const { testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/productos', productosRoutes);

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    mensaje: 'API de productos funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de Gestión de Productos y Stock',
    version: '1.0.0',
    endpoints: {
      'GET /health': 'Verificar estado del servidor',
      'POST /api/productos': 'Crear un nuevo producto',
      'GET /api/productos': 'Obtener listado de productos',
      'GET /api/productos/:id': 'Obtener un producto por ID',
      'PUT /api/productos/:id': 'Actualizar información de un producto',
      'PATCH /api/productos/:id/stock': 'Actualizar el stock de un producto',
      'DELETE /api/productos/:id': 'Eliminar un producto (lógico)',
      'DELETE /api/productos/:id?fisica=true': 'Eliminar un producto (físico)'
    }
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    detalle: err.message
  });
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  await testConnection();
});

module.exports = app;

