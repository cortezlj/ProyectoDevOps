const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const dbConfig = {
  user: 'IIPMCS',
  password: 'Group5',
  connectString: 'localhost:1521/XEPDB1' 
};

app.get('/api/usuarios', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`SELECT id, nombre, email, rol FROM usuarios`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error de conexión');
  } finally {
    if (connection) await connection.close();
  }
});

app.listen(PORT, () => console.log(`Servidor backend corriendo en http://localhost:${PORT}`));