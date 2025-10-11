<template>
    <div>
        <label :for="id" class="block text-sm font-medium text-gray-700">
            {{ label }}
            <span v-if="required" class="text-red-500">*</span>
        </label>
        <div class="mt-1 relative">
            <input
                :id="id"
                :type="type"
                :value="modelValue"
                :placeholder="placeholder"
                :required="required"
                :disabled="disabled"
                :class="inputClasses"
                @input="handleInput"
                @blur="handleBlur"
                @focus="handleFocus"
            />
            <!-- Icon (optional) -->
            <div v-if="icon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <component :is="icon" class="h-5 w-5 text-gray-400" />
            </div>
            <!-- Password toggle for password fields -->
            <button
                v-if="type === 'password'"
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                @click="togglePasswordVisibility"
            >
                <svg
                    v-if="showPassword"
                    class="h-5 w-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
                <svg
                    v-else
                    class="h-5 w-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            </button>
        </div>
        <!-- Error message -->
        <p v-if="error" class="mt-2 text-sm text-red-600">
            {{ error }}
        </p>
        <!-- Help text -->
        <p v-if="help && !error" class="mt-2 text-sm text-gray-500">
            {{ help }}
        </p>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Props
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'text',
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
  help: {
    type: String,
    default: null,
  },
  icon: {
    type: [String, Object],
    default: null,
  },
});

// Emits
const emit = defineEmits(['update:modelValue', 'blur', 'focus']);

// Reactive data
const showPassword = ref(false);
const isFocused = ref(false);

// Computed
const inputClasses = computed(() => {
  let baseClasses = 'appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200';
  
  if (props.icon) {
    baseClasses += ' pl-10';
  }
  
  if (props.type === 'password') {
    baseClasses += ' pr-10';
  }
  
  if (props.error) {
    return `${baseClasses} border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500`;
  }
  
  if (isFocused.value) {
    return `${baseClasses} border-blue-300`;
  }
  
  return `${baseClasses} border-gray-300`;
});

const actualType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password';
  }
  return props.type;
});

// Methods
const handleInput = (event) => {
  emit('update:modelValue', event.target.value);
};

const handleBlur = (event) => {
  isFocused.value = false;
  emit('blur', event);
};

const handleFocus = (event) => {
  isFocused.value = true;
  emit('focus', event);
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>
