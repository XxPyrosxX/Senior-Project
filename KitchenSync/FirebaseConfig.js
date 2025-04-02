import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import Firebase Authentication
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOgpk4HYkAjtJg3B9ddh5xHUgMeedsyEs",
  authDomain: "senior-project-2bbc6.firebaseapp.com",
  projectId: "senior-project-2bbc6",
  storageBucket: "senior-project-2bbc6.appspot.com", // Corrected storageBucket
  messagingSenderId: "563989718631",
  appId: "1:563989718631:web:081f650c97e0270ab096c2",
  measurementId: "G-RHN0ZVYEJB"
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);
const FIREBASE_AUTH = getAuth(FIREBASE_APP); // Initialize Authentication
const FIREBASE_DB = getFirestore(FIREBASE_APP);
//const analytics = getAnalytics(FIREBASE_APP);

console.log("Firebase initialized:", FIREBASE_APP);
console.log("Firebase Auth initialized:", FIREBASE_AUTH);



export { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB };