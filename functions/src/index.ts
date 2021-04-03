import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';

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

export const getGoty = functions.https.onRequest(async (request, response) => {
  // const nombre = request.query.nombre || 'Sin Nombre';
  const gotyRef = db.collection('goty');
  const docsSnap = await gotyRef.get();
  const juegos = docsSnap.docs.map(
    doc => doc.data()
  );

  response.json(juegos);
});