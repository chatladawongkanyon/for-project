import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD1xDBQ7OUX2NLJ1tLBrbo_mEj5Wr32Au0",
    authDomain: "auiia-ceb74.firebaseapp.com",
    projectId: "auiia-ceb74",
    storageBucket: "auiia-ceb74.firebasestorage.app",
    messagingSenderId: "188832852763",
    appId: "1:188832852763:web:896d3765f76cd3bb7801be",
    measurementId: "G-X9J615HYW0"
  };// Initialize Firebase app
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);