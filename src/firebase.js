// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCOp0wG6gV9hWfpxWdcLYVOebXGOFRnKQQ",
    authDomain: "dapp-3e65d.firebaseapp.com",
    projectId: "dapp-3e65d",
    storageBucket: "dapp-3e65d.firebasestorage.app",
    messagingSenderId: "933097501621",
    appId: "1:933097501621:web:c546dd733ee4d02daf1ffc",
    measurementId: "G-6K221WXTJE"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
