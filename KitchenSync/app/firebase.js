import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import Firebase Authentication
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOgpk4HYkAjtJg3B9ddh5xHUgMeedsyEs",
  authDomain: "senior-project-2bbc6.firebaseapp.com",
  projectId: "senior-project-2bbc6",
  storageBucket: "senior-project-2bbc6.firebasestorage.app",
  messagingSenderId: "563989718631",
  appId: "1:563989718631:web:081f650c97e0270ab096c2",
  measurementId: "G-RHN0ZVYEJB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Authentication
const analytics = getAnalytics(app);

// Export the auth to use in other parts of your app
export { auth };
