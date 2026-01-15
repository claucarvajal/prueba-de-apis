const mysql = require('mysql2/promise');
require('dotenv').config();

// 🔹 Configuración ORIGINAL (local) — dejada como referencia
// const pool = mysql.createPool({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'productos_db',
//   port: process.env.DB_PORT || 3306,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// 🔹 Configuración ACTUAL apuntando a Railway
// Usa variables de entorno si existen, y si no, usa los valores que me entregaste
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'switchback.proxy.rlwy.net',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'EmqjxEbSFydvUgfhxZTGEHIrGJnPFDWg',
  database: process.env.DB_NAME || 'railway',
  port: process.env.DB_PORT || 51274,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para probar la conexión
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a MySQL establecida correctamente');
    connection.release();
  } catch (error) {
    console.error('❌ Error al conectar con MySQL:', error.message);
  }
}

module.exports = { pool, testConnection };

