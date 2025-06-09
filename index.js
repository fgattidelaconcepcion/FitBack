const express = require("express");
const admin = require("firebase-admin");
const app = express();
const port = 5000;

const serviceAccount = require("./serviceAccountKey.json");

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

app.listen(port, () => {
  console.log(`✅ Backend corriendo en http://localhost:${port}`);
});
