
require('dotenv').config(); 

const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const app = express();
const PORT = process.env.PORT || 5000; 

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
} catch (error) {
  console.error("Error al cargar o parsear FIREBASE_SERVICE_ACCOUNT_KEY:", error);
  // Es crítico, así que salimos si no podemos cargar las credenciales
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(express.json());

// Asignar rol personalizado (ej: admin)
app.post("/assign-role", async (req, res) => {
  const { uid, role } = req.body;

  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    res.send(`Rol '${role}' asignado al usuario con UID: ${uid}`);
  } catch (error) {
    console.error("Error al asignar rol:", error);
    res.status(500).send("Error asignando el rol: " + error.message);
  }
});

// Consultar el rol de un usuario
app.get("/get-role/:uid", async (req, res) => {
  const { uid } = req.params;

  try {
    const user = await admin.auth().getUser(uid);
    res.json(user.customClaims || {});
  } catch (error) {
    console.error("Error al obtener rol:", error);
    res.status(500).send("Error obteniendo el rol: " + error.message);
  }
});

app.listen(PORT, () => { // <-- Paso 5: Usa la nueva variable PORT aquí
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});