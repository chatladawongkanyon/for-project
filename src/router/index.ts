import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import LoginFormView from '../views/LoginFormView.vue';
import ParkingLayoutView from '../views/ParkingLayoutView.vue'; // Renamed from LedControlView
import RegisterFormView from '../views/UserappView.vue';
import ForgotPasswordView from '../views/ForgotPasswordView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import SystemCheckView from '../views/SystemCheckView.vue'; // Renamed from AirConditionerView
import Dashboard from '../components/Dashboard.vue';
import UserappView from '../views/UserappView.vue'; // Import UserappView
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
        path: '/parking-layout',
        name: 'parking-layout',
        component: ParkingLayoutView, // Updated name
        meta: { requiresAuth: true }
    },
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: ForgotPasswordView
    },
    {
        path: '/system-check',
        name: 'system-check',
        component: SystemCheckView, // Updated name
        meta: { requiresAuth: true }
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/user-app',
        name: 'user-app',
        component: UserappView
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

    if (isAuthenticated && (to.name === 'login' || to.name === 'forgot-password')) {
        next({ name: 'dashboard' });
    } else if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'login' });
        console.log('force to login....');
    } else {
        next();
    }
});

export default router;
