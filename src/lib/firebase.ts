import { initializeApp } from 'firebase/app';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC38dynEZixecYeabGonZG6o7StLcNa9NY",
  authDomain: "genkit-codelab-fe964.firebaseapp.com",
  projectId: "genkit-codelab-fe964",
  storageBucket: "genkit-codelab-fe964.firebasestorage.app",
  messagingSenderId: "141817368829",
  appId: "1:141817368829:web:cf2e4e04c9172a222fee94",
  measurementId: "G-6B83LP4WK8"
};

export const app = initializeApp(firebaseConfig);