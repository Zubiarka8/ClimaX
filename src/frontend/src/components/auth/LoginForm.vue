<template>
    <AuthForm
        title="Sign in to your account"
        subtitle="Welcome back! Please sign in to continue."
        submit-text="Sign In"
        :is-loading="isLoading"
        :error="error"
        :initial-data="initialData"
        @submit="handleLogin"
        @update:error="clearError"
    >
        <template #default="{ formData, updateField, errors }">
            <!-- Email Field -->
            <FormField
                id="email"
                label="Email address"
                type="email"
                placeholder="Enter your email"
                required
                :model-value="formData.email"
                :error="errors.email"
                @update:model-value="(value) => updateField('email', value)"
            >
                <template #icon>
                    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                </template>
            </FormField>
            <!-- Password Field -->
            <FormField
                id="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                required
                :model-value="formData.password"
                :error="errors.password"
                @update:model-value="(value) => updateField('password', value)"
            >
                <template #icon>
                    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </template>
            </FormField>
            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        v-model="formData.rememberMe"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                        Remember me
                    </label>
                </div>
                <div class="text-sm">
                    <a href="#" class="font-medium text-blue-600 hover:text-blue-500" @click.prevent="handleForgotPassword">
                        Forgot your password?
                    </a>
                </div>
            </div>
        </template>
        <template #actions>
            <div class="text-sm">
                <span class="text-gray-600">Don't have an account? </span>
                <button
                    type="button"
                    class="font-medium text-blue-600 hover:text-blue-500"
                    @click="$emit('switch-to-register')"
                >
                    Sign up here
                </button>
            </div>
        </template>
    </AuthForm>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '../../stores/authStore.js';
import AuthForm from './AuthForm.vue';
import FormField from './FormField.vue';

const emit = defineEmits(['switch-to-register', 'login-success']);
const { login, isLoading, error, clearError } = useAuthStore();

const initialData = reactive({
    email: '',
    password: '',
    rememberMe: false,
});

const handleLogin = async (formData) => {
    try {
        const response = await login({
            email: formData.email,
            password: formData.password,
        });
        if (response.success) emit('login-success', response.data);
    } catch (err) {
        console.error('Login error:', err);
    }
};

const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
    console.log('Forgot password clicked');
};
</script>
