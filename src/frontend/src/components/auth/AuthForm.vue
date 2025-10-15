<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
        <!-- Header -->
        <div>
            <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            </div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                {{ title }}
            </h2>
            <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                {{ subtitle }}
            </p>
        </div>
        <!-- Form -->
        <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
            <!-- Error Message -->
            <div v-if="error" class="rounded-md bg-red-50 dark:bg-red-900 p-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                            {{ error }}
                        </h3>
                    </div>
                </div>
            </div>
            <!-- Success Message -->
            <div v-if="successMessage" class="rounded-md bg-green-50 dark:bg-green-900 p-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <h3 class="text-sm font-medium text-green-800 dark:text-green-200">
                            {{ successMessage }}
                        </h3>
                    </div>
                </div>
            </div>
            <!-- Form Fields -->
            <div class="space-y-4">
                <slot :formData="formData" :updateField="updateField" :errors="errors" />
            </div>
            <!-- Submit Button -->
            <div>
                <button
                    type="submit"
                    :disabled="isLoading"
                    class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </span>
                    {{ isLoading ? 'Processing...' : submitText }}
                </button>
            </div>
            <!-- Additional Actions -->
            <div class="text-center">
                <slot name="actions" />
            </div>
        </form>
        </div>
    </div>
</template>

<script setup>
    import { ref, reactive, watch } from 'vue';
    const props = defineProps({
        title: {
            type: String,
            required: true,
        },
        subtitle: {
            type: String,
            default: '',
        },
        submitText: {
            type: String,
            required: true,
        },
        isLoading: {
            type: Boolean,
            default: false,
        },
        error: {
            type: String,
            default: null,
        },
        successMessage: {
            type: String,
            default: null,
        },
        initialData: {
            type: Object,
            default: () => ({}),
        },
    });

    const emit = defineEmits(['submit', 'update:error']);
    const formData = reactive({ ...props.initialData });
    const errors = ref({});
    const updateField = (field, value) => {
        formData[field] = value;
        if (errors.value[field]) delete errors.value[field];
    };
    const handleSubmit = () => {
        errors.value = {};
        emit('submit', formData);
    };

    watch(() => props.initialData, (newData) => {
        Object.assign(formData, newData);
    }, { deep: true });

    watch(() => props.error, (newError) => {
        if (newError) emit('update:error', null);
    });
</script>
