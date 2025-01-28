const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors()); // Permitir todas las solicitudes CORS

app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).send('URL no proporcionada');
  }

  try {
    const response = await fetch(targetUrl);
    const html = await response.text();
    res.send(html); // Devuelve el HTML
  } catch (error) {
    res.status(500).send('Error al obtener los datos');
  }
});

const PORT = 3000; // Cambia el puerto si es necesario
app.listen(PORT, () => {
  console.log(`Servidor proxy corriendo en http://localhost:${PORT}`);
});
