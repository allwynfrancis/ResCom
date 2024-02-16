// firebase.jsx
// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDyU9fGk2LYb4EUxC5sMOsqc51Nags8XFQ",
  authDomain: "rescom-f7833.firebaseapp.com",
  projectId: "rescom-f7833",
  storageBucket: "rescom-f7833.appspot.com",
  messagingSenderId: "116298978025",
  appId: "1:116298978025:web:625f6ced917b6f349bd678",
  measurementId: "G-WJ22HKL3H7"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

export {
  auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
};







