import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import LoginFormView from '../views/LoginFormView.vue';
import LedControlView from '../views/LedControlView.vue';
import RegisterFormView from '../views/RegisterFormView.vue';
import ForgotPasswordView from "../views/ForgotPasswordView.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/login' // Redirect from root to /login
    },
    {
        path: '/login',
        name: 'login',
        component: LoginFormView
    },
    {
        path: '/led-control',
        name: 'led-control',
        component: LedControlView,
        meta: { requiresAuth: true }
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterFormView
    },
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: ForgotPasswordView
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

export default router;
