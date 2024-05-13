import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyC5xEDeMWotJzxi_0gq82CovrY_RgHk-3A",
    authDomain: "test-31238.firebaseapp.com",
    projectId: "test-31238",
    storageBucket: "test-31238.appspot.com",
    messagingSenderId: "950336663151",
    appId: "1:950336663151:web:d18ca25ef16fe84442279a",
    measurementId: "G-YHMZKYTNQ6"
};


initializeApp(firebaseConfig);

createApp(App).mount('#app')