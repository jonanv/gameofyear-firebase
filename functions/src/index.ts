import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';

import * as express from 'express';
import * as cors from 'cors';

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  response.json({
      message: 'Hello from Firebase!!!'
  });
});

export const getGoty = functions.https.onRequest(async(request, response) => {
  // const nombre = request.query.nombre || 'Sin Nombre';
  const gotyRef = db.collection('goty');
  const docsSnap = await gotyRef.get();
  const games = docsSnap.docs.map(
    doc => doc.data()
  );

  response.json(games);
});

// Express
const app = express();
app.use(
  cors({
    origin: true
  })
);

// GET
app.get('/goty', async(required, response) => {
  const gotyRef = db.collection('goty');
  const docsSnap = await gotyRef.get();
  const games = docsSnap.docs.map(
    doc => doc.data()
  );

  response.json(games);
});

// POST
app.post('/goty/:id', async(required, response) => {
  const id = required.params.id;
  const gameRef = db.collection('goty').doc(id);
  const gameSnap = await gameRef.get();

  if (!gameSnap.exists) {
    response.status(404).json({
      ok: false,
      message: 'No existe un juego con ese ID ' + id
    });
  }
  else {
    let before = gameSnap.data() || { votes: 0 };
    await gameRef.update({
      votes: before.votes + 1
    });
    
    response.json({
      ok: true,
      message: `Gracias por tu voto a ${ before.name }`
    });
  }
});

export const api = functions.https.onRequest(app);