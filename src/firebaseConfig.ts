// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyD1xDBQ7OUX2NLJ1tLBrbo_mEj5Wr32Au0",
    authDomain: "auiia-ceb74.firebaseapp.com",
    projectId: "auiia-ceb74",
    storageBucket: "auiia-ceb74.firebasestorage.app",
    messagingSenderId: "188832852763",
    appId: "1:188832852763:web:896d3765f76cd3bb7801be",
    measurementId: "G-X9J615HYW0"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Set auth state persistence to local, so the user stays logged in
setPersistence(auth, browserLocalPersistence);

export { auth };
