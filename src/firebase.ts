import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC5xEDeMWotJzxi_0gq82CovrY_RgHk-3A",
    authDomain: "test-31238.firebaseapp.com",
    projectId: "test-31238",
    storageBucket: "test-31238.appspot.com",
    messagingSenderId: "950336663151",
    appId: "1:950336663151:web:d18ca25ef16fe84442279a",
    measurementId: "G-YHMZKYTNQ6"
};// Initialize Firebase app
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);