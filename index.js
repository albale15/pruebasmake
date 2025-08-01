/*
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Leer la variable de entorno que configuraste en Render
const serviceAccount = require('/etc/secrets/firebaseServiceAccount.json'); // NO uses process.env acá

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
*/
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ruta del archivo secreto
const serviceAccount = require('/etc/secrets/firebaseServiceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://testingfirebasev1-dc422-default-rtdb.firebaseio.com/'
});

const db = admin.database();


// POST para sumar +1 al contador
app.post('/sumar-like', async (req, res) => {
  try {
    const ref = db.ref('contadorLikes');

    await ref.transaction((currentValue) => {
      return (currentValue || 0) + 1;
    });

    res.json({ mensaje: 'Like sumado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// GET para obtener el número de likes actuales
app.get('/contador-likes', async (req, res) => {
  try {
    const snapshot = await db.ref('contadorLikes').once('value');
    const totalLikes = snapshot.val() || 0;

    res.json({ totalLikes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
