// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configurazione Firebase (prendi questa dai tuoi dati)
const firebaseConfig = {
  apiKey: "AIzaSyD_i1dwdfSaqqiOyIp4lrrIikwmxsdADjA",
  authDomain: "calendario-d9268.firebaseapp.com",
  projectId: "calendario-d9268",
  storageBucket: "calendario-d9268.appspot.com", // correzione: deve essere .appspot.com
  messagingSenderId: "13022555286",
  appId: "1:13022555286:web:d0f4b95980dbbfd1e8a6b7"
};

// Inizializza Firebase e Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
