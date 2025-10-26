<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div class="flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-32 pb-12">
            <div class="max-w-md w-full space-y-8">
                <RegisterForm
                    @switch-to-login="$router.push('/login')"
                    @register-success="handleRegisterSuccess"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
    import { useRouter } from 'vue-router';
    import Navbar from '../../components/layout/Navbar.vue';
    import RegisterForm from '../../components/auth/RegisterForm.vue';

    const router = useRouter();
    const handleRegisterSuccess = (userData) => {
        console.log('Registration successful:', userData);
        router.push('/');
    };
</script>
