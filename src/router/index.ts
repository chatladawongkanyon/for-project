import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import LoginFormView from '../views/LoginFormView.vue';
import LedControlView from '../views/LedControlView.vue';
import RegisterFormView from '../views/RegisterFormView.vue';
import ForgotPasswordView from '../views/ForgotPasswordView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import AirConditionerView from '../views/AirConditionerView.vue';
import Dashboard from '../components/Dashboard.vue';
import { getAuth } from 'firebase/auth';

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
        path: '/register',
        name: 'register',
        component: RegisterFormView
    },
    {
        path: '/led-control',
        name: 'led-control',
        component: LedControlView,
        meta: { requiresAuth: true }
    },
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: ForgotPasswordView
    },
    {
        path: '/air-conditioner',
        name: 'air-conditioner',
        component: AirConditionerView,
        meta: { requiresAuth: true }
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/:catchAll(.*)', // Catch all undefined routes
        name: 'notfound',
        component: NotFoundView
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

// Global navigation guard to check authentication status
router.beforeEach((to, _, next) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const isAuthenticated = !!currentUser;

    if (isAuthenticated && (to.name === 'login' || to.name === 'register' || to.name === 'forgot-password')) {
        next({ name: 'dashboard' });
    } else if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'login' });
        console.log('force to login....');
    } else {
        next();
    }
});

export default router;
