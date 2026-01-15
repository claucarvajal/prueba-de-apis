# prueba-de-apis
para fundacion de la mujer
# prueba-de-apis
para fundacion de la mujer
# API de Gestión de Productos y Stock

API REST para gestionar un catálogo de productos y su stock, diseñada para ser consumida desde aplicaciones web, móviles y otros servicios.

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- MySQL (v5.7 o superior)
- npm o yarn

## 📋 PROGRAMA QUE SE USO PARA EL DESPLIEGUE: railway
<img width="1803" height="690" alt="image" src="https://github.com/user-attachments/assets/4bf1f94e-a5d7-4af9-b046-3759f1a70f92" />



## PARA QUE CORRAN LAS API 🚀 

El servidor estará disponible en `https://prueba-de-apis-production.up.railway.app`

## 📚 Endpoints de la API 
POSTMAN

### 1. Crear un producto
**POST** `/api/productos`

**Body (JSON):**
```json
{
  "nombre": "Laptop Dell XPS 20",
  "descripcion": "Laptop de alto rendimiento",
  "precio": 2099.99,
  "categoria": "Electrónica",
  "sku": "LAP-DELL-XPS20",
  "stock": 20,
  "stock_minimo": 5
}
```

**Campos obligatorios:** `nombre`, `precio`, `stock`
**Ejemplo**
post https://prueba-de-apis-production.up.railway.app/api/productos

### 2. Obtener listado de productos
**GET** `/api/productos`

**Query Parameters (opcionales):**
- `pagina`: Número de página (default: 1)
- `limite`: Productos por página (default: 10)

**Ejemplo:**
```
GET https://prueba-de-apis-production.up.railway.app/api/productos?pagina=2&limite=20
```

### 3. Obtener un producto por ID
**GET** `/api/productos/:id`

**Ejemplo:**
```
get https://prueba-de-apis-production.up.railway.app/api/productos/1
GET /api/productos/1
```

### 4. Actualizar información de un producto
**PUT** `/api/productos/:id`
put https://prueba-de-apis-production.up.railway.app/api/productos/1

**Body (JSON) - Todos los campos son opcionales:**
```json
{
  "nombre": "Producto Actualizado",
  "precio": 199.99,
  "sku": "SKU-NUEVO-123"
}
```

### 5. Actualizar el stock de un producto
**PATCH** `/api/productos/:id/stock`
https://prueba-de-apis-production.up.railway.app/api/productos/1/stock

**Body (JSON):**
```json
{
  "cantidad": 10,
  "tipo_movimiento": "ENTRADA",
  "motivo": "Reabastecimiento"
}
```

**Tipos de movimiento:**
- `ENTRADA`: Suma stock (cantidad se suma al stock actual)
- `SALIDA`: Resta stock (cantidad se resta al stock actual)
- `AJUSTE`: Establece stock directamente (cantidad = nuevo stock)

**Ejemplo de ajuste directo:**
```json
{
  "cantidad": 50,
  "tipo_movimiento": "AJUSTE"
}
```

### 6. Eliminar un producto
**DELETE** `/api/productos/:id`
https://prueba-de-apis-production.up.railway.app/api/productos/1

**Eliminación lógica (por defecto):**
```
DELETE /api/productos/1
```

**Eliminación física:**
```
https://prueba-de-apis-production.up.railway.app/api/productos/1?fisica=true
DELETE /api/productos/1?fisica=true
```

## 🧪 Ejemplos de Uso con Postman

### Crear Producto
1. Método: **POST**
2. URL: `https://prueba-de-apis-production.up.railway.app/api/productos`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "nombre": "Teclado Mecánico",
  "descripcion": "Teclado mecánico con switches Cherry MX",
  "precio": 129.99,
  "categoria": "Accesorios",
  "sku": "TEC-MEC-CHERRY",
  "stock": 25,
  "stock_minimo": 5
}
```

### Obtener Todos los Productos
1. Método: **GET**
2. URL: `https://prueba-de-apis-production.up.railway.app/api/productos`

### Obtener Producto por ID
1. Método: **GET**
2. URL: `https://prueba-de-apis-production.up.railway.app/api/productos/1`

### Actualizar Producto
1. Método: **PUT**
2. URL: `https://prueba-de-apis-production.up.railway.app/api/productos/1`
3. Body (raw JSON):
```json
{
  "cantidad": 5,
  "tipo_movimiento": "ENTRADA",
  "motivo": "Reposición de stock"
}
```

### Actualizar Stock (Entrada)
1. Método: **PATCH**
2. URL: `https://prueba-de-apis-production.up.railway.app/api/productos/1/stock`
3. Body (raw JSON):
```json
{
  "cantidad": 15,
  "tipo_movimiento": "ENTRADA",
  "motivo": "Compra de proveedor"
}
```

### Actualizar Stock (Salida)
1. Método: **PATCH**
2. URL: `https://prueba-de-apis-production.up.railway.app/api/productos/1/stock`
3. Body (raw JSON):
```json
{
  "cantidad": 5,
  "tipo_movimiento": "SALIDA",
  "motivo": "Venta"
}
```

### Eliminar Producto (Lógico)
1. Método: **DELETE**
2. URL: `https://prueba-de-apis-production.up.railway.app/api/productos/1`

### Eliminar Producto (Físico)
1. Método: **DELETE**
2. URL: `https://prueba-de-apis-production.up.railway.app/api/productos/1?fisica=true`






## 🚀 Instalación ---esto es lo que se hace para el paso a paso en el LOCALHOST

1. **Clonar o descargar el proyecto**

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar la base de datos:**
   - Crear la base de datos en MySQL:
   ```sql
   CREATE DATABASE productos_db;
   ```
   - Ejecutar el script SQL para crear las tablas:
   ```bash
   mysql -u root -p productos_db < database/schema.sql
   ```
   O ejecutar el contenido de `database/schema.sql` directamente en MySQL.

4. **Configurar variables de entorno:**
   - Copiar el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```
   - Editar `.env` con tus credenciales de MySQL:
   ```
   DB_HOST=switchback.proxy.rlwy.net
   DB_USER=root
   DB_PASSWORD=EmqjxEbSFydvUgfhxZTGEHIrGJnPFDWg
   DB_NAME=railway
   DB_PORT=51274
   PORT=3000
   ```

   Nota: puerto configurado en despliegue: 8080

5. **Iniciar el servidor:**
```bash
npm start
```

Para desarrollo con recarga automática:
```bash
npm run dev
```


## 📊 Estructura de la Base de Datos

### Tabla: `productos`
- `id`: INT (Primary Key, Auto Increment)
- `nombre`: VARCHAR(255) - Nombre del producto
- `descripcion`: TEXT - Descripción del producto
- `precio`: DECIMAL(10,2) - Precio del producto
- `categoria`: VARCHAR(100) - Categoría del producto
- `sku`: VARCHAR(100) - Código SKU único
- `stock`: INT - Cantidad en stock
- `stock_minimo`: INT - Stock mínimo requerido
- `activo`: BOOLEAN - Estado activo/inactivo
- `fecha_creacion`: TIMESTAMP
- `fecha_actualizacion`: TIMESTAMP
- `fecha_eliminacion`: TIMESTAMP (NULL para eliminación lógica)

### Tabla: `movimientos_stock` (Historial)
- `id`: INT (Primary Key, Auto Increment)
- `producto_id`: INT (Foreign Key)
- `tipo_movimiento`: ENUM('ENTRADA', 'SALIDA', 'AJUSTE')
- `cantidad`: INT
- `cantidad_anterior`: INT
- `cantidad_nueva`: INT
- `motivo`: VARCHAR(255)
- `fecha_movimiento`: TIMESTAMP

## 🔍 Verificar Estado del Servidor

**GET** `/health`

Respuesta:
```json
{
  "status": "OK",
  "mensaje": "API de productos funcionando correctamente",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 📝 Notas

- La eliminación lógica es el comportamiento por defecto. Los productos eliminados lógicamente no aparecen en las consultas normales.
- El stock no puede ser negativo. Si intentas hacer una salida que resulte en stock negativo, recibirás un error.
- El SKU debe ser único. Si intentas crear un producto con un SKU existente, recibirás un error 409.
- Todos los endpoints devuelven respuestas en formato JSON.

## 🛠️ Tecnologías Utilizadas

- Node.js
- Express.js
- MySQL2
- dotenv
- CORS


CLAUDIA MARCELA CARVAJAL 
