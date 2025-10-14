<template>
    <div>
        <RegisterForm
            @switch-to-login="$router.push('/login')"
            @register-success="handleRegisterSuccess"
        />
    </div>
</template>

<script setup>
    import { useRouter } from 'vue-router';
    import RegisterForm from '../../components/auth/RegisterForm.vue';

    const router = useRouter();
    const handleRegisterSuccess = (userData) => {
        console.log('Registration successful:', userData);
        router.push('/');
    };
</script>
