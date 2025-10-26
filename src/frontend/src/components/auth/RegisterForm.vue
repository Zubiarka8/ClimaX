<template>
    <AuthForm
        title="Create your account"
        subtitle="Join ClimaX and start tracking weather data."
        submit-text="Create Account"
        :is-loading="isLoading"
        :error="error"
        :initial-data="initialData"
        @submit="handleRegister"
        @update:error="clearError"
    >
    <template #default="{ formData, updateField, errors }">
        <!-- Full Name Field -->
        <FormField
            id="fullname"
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            required
            :model-value="formData.fullname"
            :error="errors.fullname"
            @update:model-value="(value) => updateField('fullname', value)"
        >
            <template #icon>
                <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </template>
        </FormField>
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
            @blur="checkEmailExists"
        >
            <template #icon>
                <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
            </template>
        </FormField>
        <!-- Username Field -->
        <FormField
            id="username"
            label="Username"
            type="text"
            placeholder="Choose a username (optional)"
            :model-value="formData.username"
            :error="errors.username"
            :help="usernameHelp"
            @update:model-value="(value) => updateField('username', value)"
            @blur="checkUsernameExists"
        >
            <template #icon>
                <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
            </template>
        </FormField>
        <!-- Password Field -->
        <FormField
            id="password"
            label="Password"
            type="password"
            placeholder="Create a password"
            required
            :model-value="formData.password"
            :error="errors.password"
            :help="passwordHelp"
            @update:model-value="(value) => updateField('password', value)"
        >
            <template #icon>
                <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            </template>
        </FormField>
        <!-- Confirm Password Field -->
        <FormField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            required
            :model-value="formData.confirmPassword"
            :error="errors.confirmPassword"
            @update:model-value="(value) => updateField('confirmPassword', value)"
        >
            <template #icon>
                <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </template>
        </FormField>
        <!-- Terms and Conditions -->
        <div class="flex items-start">
            <Checkbox
                id="terms"
                name="terms"
                v-model="formData.acceptTerms"
                variant="primary"
                size="md"
                required
            />
            <label for="terms" class="ml-3 block text-sm text-gray-900 dark:text-gray-300 leading-5">
                I agree to the 
                <a href="#" class="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline">Terms and Conditions</a>
                and 
                <a href="#" class="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline">Privacy Policy</a>
            </label>
        </div>
    </template>
    <template #actions>
        <div class="text-sm">
            <span class="text-gray-600 dark:text-gray-400">Already have an account? </span>
                <button
                    type="button"
                    class="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                    @click="$emit('switch-to-login')"
                >
                Sign in here
                </button>
        </div>
        </template>
    </AuthForm>
</template>

<script setup>
    import { ref, reactive, computed } from 'vue';
    import { useAuthStore } from '../../stores/authStore.js';
    import AuthForm from './AuthForm.vue';
    import FormField from './FormField.vue';
    import Checkbox from '../ui/Checkbox.vue';

    const emit = defineEmits(['switch-to-login', 'register-success']);

    const { register, checkUserExists, isLoading, error, clearError } = useAuthStore();

    const initialData = reactive({
        fullname: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
    });

    const passwordHelp = computed(() => {
        const password = initialData.password;
        if (!password) return '';
        const hasMinLength = password.length >= 6;
        const hasMaxLength = password.length <= 128;
        if (!hasMinLength) return 'Password must be at least 6 characters long';
        if (!hasMaxLength) return 'Password must be less than 128 characters';
        return 'Password looks good!';
    });

    const usernameHelp = computed(() => {
        const username = initialData.username;
        if (!username) return 'Username is optional';
        if (username.length < 3) return 'Username must be at least 3 characters long';
        return 'Username looks good!';
    });

    const validateForm = (formData) => {
        const errors = {};
        if (!formData.fullname || formData.fullname.trim().length < 2) errors.fullname = 'Full name must be at least 2 characters long';
        if (!formData.email || !isValidEmail(formData.email)) errors.email = 'Please enter a valid email address';
        if (formData.username && formData.username.trim().length < 3) errors.username = 'Username must be at least 3 characters long';
        if (!formData.password || formData.password.length < 6) errors.password = 'Password must be at least 6 characters long';
        if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
        if (!formData.acceptTerms) errors.terms = 'You must accept the terms and conditions';
        return errors;
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const checkEmailExists = async () => {
        if (!initialData.email || !isValidEmail(initialData.email)) return;
        try {
            const response = await checkUserExists(initialData.email);
            if (response.data.exists) {
                // Email exists, but we'll let the backend handle this during registration
                console.log('Email already exists');
            }
        } catch (err) {
            console.error('Error checking email:', err);
        }
    };

    const checkUsernameExists = async () => {
        if (!initialData.username || initialData.username.length < 3) return;
        try {
            const response = await checkUserExists(null, initialData.username);
            if (response.data.exists) console.log('Username already exists');
        } catch (err) {
            console.error('Error checking username:', err);
        }
    };

    const handleRegister = async (formData) => {
        // Validate form
        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            // Set errors in the form
            Object.assign(formData, { errors });
            return;
        }
        try {
            const response = await register({
                fullname: formData.fullname,
                email: formData.email,
                username: formData.username || null,
                password: formData.password,
            });
            if (response.success) emit('register-success', response.data);
        } catch (err) {
            console.error('Registration error:', err);
        }
    };
</script>
