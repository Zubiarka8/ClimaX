<template>
    <div>
        <LoginForm
            @switch-to-register="$router.push('/register')"
            @login-success="handleLoginSuccess"
        />
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import LoginForm from '../../components/auth/LoginForm.vue';

const router = useRouter();
const handleLoginSuccess = (userData) => {
    console.log('Login successful:', userData);
    router.push('/');
};
</script>
