const { pool } = require('../config/database');

// Crear un nuevo producto
const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria, sku, stock, stock_minimo } = req.body;

    // Validaciones básicas
    if (!nombre || !precio) {
      return res.status(400).json({
        error: 'El nombre y el precio son obligatorios'
      });
    }

    if (stock === undefined) {
      return res.status(400).json({
        error: 'El stock es obligatorio'
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO productos (nombre, descripcion, precio, categoria, sku, stock, stock_minimo)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion || null, precio, categoria || null, sku || null, stock, stock_minimo || 0]
    );

    const [producto] = await pool.execute(
      'SELECT * FROM productos WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      mensaje: 'Producto creado exitosamente',
      producto: producto[0]
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        error: 'El SKU ya existe en la base de datos'
      });
    }
    console.error('Error al crear producto:', error);
    res.status(500).json({
      error: 'Error al crear el producto',
      detalle: error.message
    });
  }
};

// Obtener listado de productos (sin filtros por campos, solo paginación)
const obtenerProductos = async (req, res) => {
  try {
    const { pagina = 1, limite = 10 } = req.query;

    // Convertir a enteros y validar
    const paginaNum = Math.max(1, parseInt(pagina) || 1);
    const limiteNum = Math.max(1, Math.min(100, parseInt(limite) || 10)); // Máximo 100 por página
    const offset = (paginaNum - 1) * limiteNum;

    // Solo productos no eliminados lógicamente, ordenados por fecha
    const query = `SELECT * FROM productos 
                   WHERE fecha_eliminacion IS NULL 
                   ORDER BY fecha_creacion DESC 
                   LIMIT ${limiteNum} OFFSET ${offset}`;

    const [productos] = await pool.execute(query);

    // Obtener total para paginación (sin filtros)
    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM productos WHERE fecha_eliminacion IS NULL'
    );
    const total = countResult[0].total;

    res.json({
      productos,
      paginacion: {
        pagina: paginaNum,
        limite: limiteNum,
        total,
        totalPaginas: Math.ceil(total / limiteNum)
      }
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      error: 'Error al obtener los productos',
      detalle: error.message
    });
  }
};

// Obtener un producto por ID
const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const [productos] = await pool.execute(
      'SELECT * FROM productos WHERE id = ? AND fecha_eliminacion IS NULL',
      [id]
    );

    if (productos.length === 0) {
      return res.status(404).json({
        error: 'Producto no encontrado'
      });
    }

    res.json(productos[0]);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({
      error: 'Error al obtener el producto',
      detalle: error.message
    });
  }
};

// Actualizar información de un producto
const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, categoria, sku, stock_minimo } = req.body;

    // Verificar que el producto existe y no está eliminado
    const [productos] = await pool.execute(
      'SELECT * FROM productos WHERE id = ? AND fecha_eliminacion IS NULL',
      [id]
    );

    if (productos.length === 0) {
      return res.status(404).json({
        error: 'Producto no encontrado'
      });
    }

    // Construir query dinámicamente solo con los campos proporcionados
    const campos = [];
    const valores = [];

    if (nombre !== undefined) {
      campos.push('nombre = ?');
      valores.push(nombre);
    }
    if (descripcion !== undefined) {
      campos.push('descripcion = ?');
      valores.push(descripcion);
    }
    if (precio !== undefined) {
      campos.push('precio = ?');
      valores.push(precio);
    }
    if (categoria !== undefined) {
      campos.push('categoria = ?');
      valores.push(categoria);
    }
    if (sku !== undefined) {
      // Verificar si el SKU ya existe en otro producto
      const [skuExistente] = await pool.execute(
        'SELECT id FROM productos WHERE sku = ? AND id != ? AND fecha_eliminacion IS NULL',
        [sku, id]
      );
      
      if (skuExistente.length > 0) {
        return res.status(409).json({
          error: 'El SKU ya existe en otro producto'
        });
      }
      
      campos.push('sku = ?');
      valores.push(sku);
    }
    if (stock_minimo !== undefined) {
      campos.push('stock_minimo = ?');
      valores.push(stock_minimo);
    }

    if (campos.length === 0) {
      return res.status(400).json({
        error: 'No se proporcionaron campos para actualizar'
      });
    }

    valores.push(id);

    const query = `UPDATE productos SET ${campos.join(', ')} WHERE id = ? AND fecha_eliminacion IS NULL`;

    await pool.execute(query, valores);

    // Obtener el producto actualizado
    const [productoActualizado] = await pool.execute(
      'SELECT * FROM productos WHERE id = ?',
      [id]
    );

    res.json({
      mensaje: 'Producto actualizado exitosamente',
      producto: productoActualizado[0]
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        error: 'El SKU ya existe en otro producto'
      });
    }
    console.error('Error al actualizar producto:', error);
    res.status(500).json({
      error: 'Error al actualizar el producto',
      detalle: error.message
    });
  }
};

// Actualizar el stock de un producto
const actualizarStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad, tipo_movimiento, motivo } = req.body;

    if (cantidad === undefined) {
      return res.status(400).json({
        error: 'La cantidad es obligatoria'
      });
    }

    // Verificar que el producto existe y no está eliminado
    const [productos] = await pool.execute(
      'SELECT * FROM productos WHERE id = ? AND fecha_eliminacion IS NULL',
      [id]
    );

    if (productos.length === 0) {
      return res.status(404).json({
        error: 'Producto no encontrado'
      });
    }

    const producto = productos[0];
    const stockAnterior = producto.stock;
    let stockNuevo;

    // Calcular nuevo stock según el tipo de movimiento
    if (tipo_movimiento === 'ENTRADA') {
      stockNuevo = stockAnterior + cantidad;
    } else if (tipo_movimiento === 'SALIDA') {
      stockNuevo = stockAnterior - cantidad;
      if (stockNuevo < 0) {
        return res.status(400).json({
          error: 'No hay suficiente stock disponible'
        });
      }
    } else if (tipo_movimiento === 'AJUSTE') {
      stockNuevo = cantidad;
    } else {
      // Por defecto, ajuste directo
      stockNuevo = cantidad;
    }

    // Actualizar stock
    await pool.execute(
      'UPDATE productos SET stock = ? WHERE id = ?',
      [stockNuevo, id]
    );

    // Registrar movimiento en historial (opcional)
    try {
      await pool.execute(
        `INSERT INTO movimientos_stock (producto_id, tipo_movimiento, cantidad, cantidad_anterior, cantidad_nueva, motivo)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, tipo_movimiento || 'AJUSTE', Math.abs(cantidad), stockAnterior, stockNuevo, motivo || null]
      );
    } catch (error) {
      console.warn('No se pudo registrar el movimiento en el historial:', error.message);
    }

    // Obtener producto actualizado
    const [productoActualizado] = await pool.execute(
      'SELECT * FROM productos WHERE id = ?',
      [id]
    );

    res.json({
      mensaje: 'Stock actualizado exitosamente',
      producto: productoActualizado[0],
      movimiento: {
        stock_anterior: stockAnterior,
        stock_nuevo: stockNuevo,
        diferencia: stockNuevo - stockAnterior
      }
    });
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    res.status(500).json({
      error: 'Error al actualizar el stock',
      detalle: error.message
    });
  }
};

// Eliminar un producto (eliminación lógica)
const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { fisica } = req.query; // ?fisica=true para eliminación física

    // Verificar que el producto existe
    const [productos] = await pool.execute(
      'SELECT * FROM productos WHERE id = ?',
      [id]
    );

    if (productos.length === 0) {
      return res.status(404).json({
        error: 'Producto no encontrado'
      });
    }

    if (fisica === 'true') {
      // Eliminación física
      await pool.execute('DELETE FROM productos WHERE id = ?', [id]);
      res.json({
        mensaje: 'Producto eliminado físicamente de la base de datos'
      });
    } else {
      // Eliminación lógica
      await pool.execute(
        'UPDATE productos SET activo = FALSE, fecha_eliminacion = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );
      res.json({
        mensaje: 'Producto eliminado lógicamente (soft delete)'
      });
    }
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({
      error: 'Error al eliminar el producto',
      detalle: error.message
    });
  }
};

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  actualizarStock,
  eliminarProducto
};

