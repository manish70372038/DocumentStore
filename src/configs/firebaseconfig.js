// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAL1mfUKFGeEFuX-njkA9ojHmtaIgkaCW0",
  authDomain: "d-ocsave.firebaseapp.com",
  projectId: "d-ocsave",
  storageBucket: "d-ocsave.firebasestorage.app",
  messagingSenderId: "264862026941",
  appId: "1:264862026941:web:86a27b92cec69c764f3bd4",
  measurementId: "G-P1RWTXVL7P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);