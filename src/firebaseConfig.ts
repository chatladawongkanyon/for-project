// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyC5xEDeMWotJzxi_0gq82CovrY_RgHk-3A",
    authDomain: "test-31238.firebaseapp.com",
    projectId: "test-31238",
    storageBucket: "test-31238.appspot.com",
    messagingSenderId: "950336663151",
    appId: "1:950336663151:web:d18ca25ef16fe84442279a",
    measurementId: "G-YHMZKYTNQ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Set auth state persistence to local, so the user stays logged in
setPersistence(auth, browserLocalPersistence);

export { auth };
