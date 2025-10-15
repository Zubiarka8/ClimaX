<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div class="flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-32 pb-12">
            <div class="max-w-md w-full space-y-8">
                <LoginForm
                    @switch-to-register="$router.push('/register')"
                    @login-success="handleLoginSuccess"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Navbar from '../../components/layout/Navbar.vue';
import LoginForm from '../../components/auth/LoginForm.vue';

const router = useRouter();
const handleLoginSuccess = (userData) => {
    console.log('Login successful:', userData);
    router.push('/');
};
</script>
