import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { initializeApp } from "firebase/app";



import router from './router';
// Import your firebase configuration

// // Check authentication state before initializing the app
// auth.onAuthStateChanged(() => {
//     createApp(App)
//         .use(router)
//         .mount('#app');
// });

// const routes = [
//     {
//         path: '/login',
//         name: 'login',
//         component: LoginForm,
//     },
//
//     {
//         path: '/register',
//         name: 'register',
//         component: RegisterForm,
//     },
//     // Other routes...
// ];

// const router = createRouter({
//     history: createWebHistory(),
//     routes,
// });
//
// export default router;


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

const app = createApp(App);
app.use(router);
app.mount('#app');