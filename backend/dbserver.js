const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 4001;

app.use(cors()); // Habilita CORS para permitir solicitudes desde tu frontend
app.use(express.json()); // Permite el parsing de JSON en las solicitudes

// Conectar a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'r1234',
  database: 'quimiap'
});

connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.stack);
    return;
  }
  console.log('Conexión exitosa a la base de datos.');
});

// Consulta general de la tabla Usuario
app.get('/usuarios', (req, res) => {
  const query = 'SELECT * FROM Usuario';
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al realizar la consulta:', error);
      res.status(500).json({ error: 'Error al realizar la consulta' });
    } else {
      res.json(results); // Devuelve los resultados de la consulta
    }
  });
});

// Consulta general de la tabla Categoria
app.get('/categoria', (req, res) => {
  const query = 'SELECT * FROM Categoria';
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al realizar la consulta:', error);
      res.status(500).json({ error: 'Error al realizar la consulta' });
    } else {
      res.json(results); // Devuelve los resultados de la consulta
    }
  });
});


// Resgistrar usuarios 
app.post('/registrarUser', (req, res) => {
    const {
      nombres, 
      apellidos, 
      telefono, 
      correo_electronico, 
      tipo_doc, 
      num_doc, 
      contrasena, 
      rol 
    } = req.body;

    const query = `CALL RegistrarUsuario(?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(query, 
      [nombres, apellidos, telefono, correo_electronico, tipo_doc, num_doc, contrasena, rol], 
      (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            return res.status(500).json({ success: false, error: err });
        }
        res.json({ success: true, results });
    });
});
// endpoint para actualizar usuarios
app.put('/actualizarUser/:id_usuario', (req, res) => {
    const {
        id_usuario,            // ID del usuario a actualizar
        nombres, 
        apellidos, 
        telefono, 
        correo_electronico, 
        tipo_doc, 
        num_doc, 
        contrasena, 
        estado, 
        rol 
    } = req.body;

    const query = `CALL ActualizarUsuario(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(query, 
      [id_usuario, nombres, apellidos, telefono, correo_electronico, tipo_doc, num_doc, contrasena, estado, rol], 
      (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            return res.status(500).json({ success: false, error: err });
        }
        res.json({ success: true, results });
    });
});

// Endpoint para cambiar estado al usuario
app.put('/cambiarEstadoUsuario/:id_usuario', (req, res) => {
  const { estado } = req.body; // Se espera que el estado venga en el cuerpo de la solicitud
  const id_usuario = req.params.id_usuario; // Obtener el ID del usuario desde la URL

  const query = `CALL CambiarEstadoUsuario(?, ?)`;

  connection.query(query, [id_usuario, estado], (err, results) => {
      if (err) {
          console.error('Error ejecutando la consulta:', err);
          return res.status(500).json({ success: false, error: err });
      }
      res.json({ success: true, results });
  });
});


// Consulta general de la tabla Producto
app.get('/Producto', (req, res) => {
  const query = `
      SELECT 
          p.id_producto,
          p.nombre,
          p.descripcion,
          p.composicion,
          p.contenido_neto,
          p.usos,
          p.advertencias,
          p.cantidad_producto,
          p.precio_unitario,
          p.estado,
          c.nombre_categoria AS categoria,
          p.imagen
      FROM 
          Producto p
      JOIN 
          Categoria c ON p.categoria_id = c.id_categoria;
  `;

  connection.query(query, (error, results) => {
      if (error) {
          console.error('Error al realizar la consulta:', error);
          res.status(500).json({ error: 'Error al realizar la consulta' });
      } else {
          res.json(results); // Devuelve los resultados de la consulta
      }
  });
});

// Registrar un nuevo producto
app.post('/registrarProducto', (req, res) => {
  const {
      nombre, 
      descripcion, 
      imagen, 
      categoria_id, // Cambié a categoria_id para que coincida con la estructura de la tabla
      composicion, 
      contenido_neto, 
      usos, 
      advertencias, 
      cantidad_producto, 
      precio_unitario, 
      estado 
  } = req.body;

  const query = `CALL RegistrarProducto(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  connection.query(query, 
    [nombre, descripcion, imagen, categoria_id, composicion, contenido_neto, usos, advertencias, cantidad_producto, precio_unitario, estado], 
    (err, results) => {
      if (err) {
          console.error('Error ejecutando la consulta:', err);
          return res.status(500).json({ success: false, error: err });
      }
      res.json({ success: true, results });
  });
});

// Actualizar un producto
app.put('/actualizarProducto', (req, res) => {
  const {
      id_producto, 
      nombre, 
      descripcion, 
      imagen, 
      categoria_id, 
      composicion, 
      contenido_neto, 
      usos, 
      advertencias, 
      cantidad_producto, 
      precio_unitario, 
      estado 
  } = req.body;

  const query = `CALL ActualizarProducto(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  connection.query(query, 
    [id_producto, nombre, descripcion, imagen, categoria_id, composicion, contenido_neto, usos, advertencias, cantidad_producto, precio_unitario, estado], 
    (err, results) => {
      if (err) {
          console.error('Error ejecutando la consulta:', err);
          return res.status(500).json({ success: false, error: err });
      }
      res.json({ success: true, results });
  });
});

// Cambiar estado de un producto
// Descontinuar un producto
app.put('/descontinuarProducto', (req, res) => {
  const { id_producto } = req.body; // Asegúrate de recibir el ID del producto

  const query = `UPDATE Producto SET estado = 'descontinuado' WHERE id_producto = ?`;

  connection.query(query, [id_producto], (err, results) => {
      if (err) {
          console.error('Error ejecutando la consulta:', err);
          return res.status(500).json({ success: false, error: err });
      }
      res.json({ success: true, message: 'Producto descontinuado correctamente' });
  });
});


app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
