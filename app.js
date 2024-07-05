// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const admin = require('firebase-admin');
// const serviceAccount = require('./firebase-service-account.json');

const firebase = require('firebase/compat/app');
require('firebase/compat/auth');
require('firebase/compat/firestore');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://<your-database-name>.firebaseio.com"
// });


// Initialisez Firebase avec votre configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYStue523q9M87v5Jqih1WatJ8RoPO0ig",
  authDomain: "quizo-ddb65.firebaseapp.com",
  projectId: "quizo-ddb65",
  storageBucket: "quizo-ddb65.appspot.com",
  messagingSenderId: "167262174086",
  appId: "1:167262174086:web:e988f1fdd16b732c640a07",
  measurementId: "G-Q31MFDMPTB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);



const db = firebase.firestore();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Endpoint pour récupérer les questions
app.get('/questions', async (req, res) => {
  try {
    const snapshot = await db.collection('questions').get();
    const questions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Error lors de la rrecup des questions' });
  }
});


// Endpoint pour récupérer 10 questions aléatoires ou toutes les questions si moins de 10
app.get('/questions/random', async (req, res) => {
  try {
    const snapshot = await db.collection('questions').get();
    let questions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (questions.length > 10) {
      questions = questions.sort(() => 0.5 - Math.random()).slice(0, 10);
    }

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la recup des questions' });
  }
});

// Endpoint pour ajouter une nouvelle question
app.post('/questions', async (req, res) => {
  try {
    const questionData = req.body;
    await db.collection('questions').add(questionData);
    res.status(201).json({ message: 'Question Ajoutee' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout de la question' });
  }
});

// Endpoint pour mettre à jour une question
app.put('/questions/:id', async (req, res) => {
  try {
    const questionId = req.params.id;
    const questionData = req.body;
    await db.collection('questions').doc(questionId).update(questionData);
    res.status(200).json({ message: 'Question Mise a Jour' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de laa ise a jour de la question' });
  }
});

// Endpoint pour supprimer une question
app.delete('/questions/:id', async (req, res) => {
  try {
    const questionId = req.params.id;
    await db.collection('questions').doc(questionId).delete();
    res.status(200).json({ message: 'Question supprimee' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
