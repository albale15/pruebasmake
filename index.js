const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Leer la variable de entorno que configuraste en Render
const serviceAccount = require('/secrets/firebaseServiceAccount.json'); // NO uses process.env acá

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://testingfirebasev1-dc422-default-rtdb.firebaseio.com/' // tu URL
});

const db = admin.database();

// Rutas
app.post('/autorizar-invitado', async (req, res) => {
  const { username, like } = req.body;
  if (!username) return res.status(400).json({ error: "Falta el campo 'username'" });

  try {
    await db.ref('invitados/' + username).set({
      liked: like || false,
      timestamp: Date.now()
    });
    res.json({ mensaje: "Usuario autorizado guardado en Firebase" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/verificar-invitado/:username', async (req, res) => {
  const username = req.params.username;

  try {
    const snapshot = await db.ref('invitados/' + username).once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ autorizado: false, mensaje: "Usuario no encontrado" });
    }
    const data = snapshot.val();
    res.json({ autorizado: data.liked, usuario: username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
