// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKrQCWQgQGm860JEhP6Fzkt13g57xbu5I",
  authDomain: "de-partie.firebaseapp.com",
  projectId: "de-partie",
  storageBucket: "de-partie.firebasestorage.app",
  messagingSenderId: "784162507120",
  appId: "1:784162507120:web:0874727e985d4342f127b5",
  measurementId: "G-TYHEKXRHZ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

export { app, db };