import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore.js';

import HomePage from '../pages/HomePage.vue';
import LoginPage from '../pages/auth/LoginPage.vue';
import RegisterPage from '../pages/auth/RegisterPage.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage,
        meta: { requiresAuth: false }
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginPage,
        meta: { requiresAuth: false, hideForAuth: true }
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterPage,
        meta: { requiresAuth: false, hideForAuth: true }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        redirect: '/'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Guards
router.beforeEach((to, from, next) => {
    const { isAuthenticated } = useAuthStore();
    // Check if route requires authentication
    if (to.meta.requiresAuth && !isAuthenticated.value) {
        next('/login');
        return;
    }
    // Redirect authenticated users away from auth pages
    if (to.meta.hideForAuth && isAuthenticated.value) {
        next('/');
        return;
    }
    next();
});

export default router;
