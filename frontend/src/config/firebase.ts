import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";

// Firebase App Configuration for EcoSense
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCPTAXKo6QSxH-O1MFgER8uW0a6iwtPJTQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ecosense-cc281.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ecosense-cc281",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ecosense-cc281.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "438291048291",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:438291048291:web:a9d8c7b6a5f4e3d2",
};

// Initialize Firebase SDK
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider("apple.com");
