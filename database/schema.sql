-- Base de datos para gestión de productos y stock
-- Crear la base de datos (ejecutar manualmente si no existe)
-- CREATE DATABASE IF NOT EXISTS productos_db;
-- USE productos_db;

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    categoria VARCHAR(100),
    sku VARCHAR(100) UNIQUE,
    stock INT NOT NULL DEFAULT 0,
    stock_minimo INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fecha_eliminacion TIMESTAMP NULL,
    INDEX idx_nombre (nombre),
    INDEX idx_categoria (categoria),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de historial de movimientos de stock (opcional, para auditoría)
CREATE TABLE IF NOT EXISTS movimientos_stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    tipo_movimiento ENUM('ENTRADA', 'SALIDA', 'AJUSTE') NOT NULL,
    cantidad INT NOT NULL,
    cantidad_anterior INT NOT NULL,
    cantidad_nueva INT NOT NULL,
    motivo VARCHAR(255),
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    INDEX idx_producto (producto_id),
    INDEX idx_fecha (fecha_movimiento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar algunos productos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, categoria, sku, stock, stock_minimo) VALUES
('Laptop Dell XPS 13', 'Laptop ultraliviana con procesador Intel i7', 1299.99, 'Electrónica', 'LAP-DELL-XPS13', 15, 5),
('Mouse Logitech MX Master', 'Mouse inalámbrico ergonómico', 89.99, 'Accesorios', 'MOU-LOG-MX', 50, 10),
('Teclado Mecánico RGB', 'Teclado mecánico con iluminación RGB', 149.99, 'Accesorios', 'TEC-MEC-RGB', 30, 8),
('Monitor 27" 4K', 'Monitor 4K UHD con panel IPS', 399.99, 'Electrónica', 'MON-27-4K', 20, 5);

