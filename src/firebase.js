// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "QUI-TUA-API-KEY",
  authDomain: "QUI-TUA-AUTHDOMAIN",
  projectId: "QUI-TUA-PROJECTID",
  storageBucket: "QUI-TUA-STORAGEBUCKET",
  messagingSenderId: "QUI-TUA-MESSAGINGID",
  appId: "QUI-TUA-APPID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
