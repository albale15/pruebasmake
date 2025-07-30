const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const invitados = {}; // base en memoria para pruebas

app.post('/autorizar-invitado', (req, res) => {
  const { username, like } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Falta el campo 'username'" });
  }
  invitados[username] = { liked: like || false, timestamp: Date.now() };
  res.json({ mensaje: "Usuario autorizado guardado" });
});

app.get('/verificar-invitado/:username', (req, res) => {
  const username = req.params.username;
  if (!invitados[username]) {
    return res.status(404).json({ autorizado: false, mensaje: "Usuario no encontrado" });
  }
  res.json({ autorizado: invitados[username].liked, usuario: username });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});