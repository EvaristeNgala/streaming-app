// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // <-- import Auth

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDk69Iu-w8rYQMZHVab7kkFRubXV2VEWQo",
  authDomain: "streaming-dashboard-cec40.firebaseapp.com",
  projectId: "streaming-dashboard-cec40",
  storageBucket: "streaming-dashboard-cec40.appspot.com",
  messagingSenderId: "15377829010",
  appId: "1:15377829010:web:79257cd3a0222f57bcea4b",
  measurementId: "G-00V2WH9SCG"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore
export const db = getFirestore(app);

// Export Auth pour la connexion / inscription
export const auth = getAuth(app);
