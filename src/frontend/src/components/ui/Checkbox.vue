<template>
  <div class="flex items-center">
    <div class="relative">
      <input
        :id="id"
        :name="name"
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        :required="required"
        class="sr-only"
        @change="handleChange"
      />
      <div
        :class="[
          'w-5 h-5 rounded border-2 transition-all duration-200 cursor-pointer flex items-center justify-center',
          checkboxClasses
        ]"
        @click="handleClick"
      >
        <!-- Checkmark icon -->
        <svg
          v-if="modelValue"
          class="w-3 h-3 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>
    <label
      v-if="label"
      :for="id"
      :class="[
        'ml-3 text-sm font-medium cursor-pointer select-none transition-colors duration-200',
        labelClasses
      ]"
      @click="handleClick"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '../../composables/useTheme.js'

// Props
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'warning', 'error'].includes(value)
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'change'])

const { isDarkMode } = useTheme()

// Computed classes
const checkboxClasses = computed(() => {
  const baseClasses = 'border-2 transition-all duration-200'
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }
  
  if (props.disabled) {
    return `${baseClasses} ${sizeClasses[props.size]} border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-50`
  }
  
  if (props.modelValue) {
    const checkedClasses = {
      primary: 'bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600',
      secondary: 'bg-gray-600 dark:bg-gray-500 border-gray-600 dark:border-gray-500 hover:bg-gray-700 dark:hover:bg-gray-600',
      success: 'bg-green-600 dark:bg-green-500 border-green-600 dark:border-green-500 hover:bg-green-700 dark:hover:bg-green-600',
      warning: 'bg-yellow-600 dark:bg-yellow-500 border-yellow-600 dark:border-yellow-500 hover:bg-yellow-700 dark:hover:bg-yellow-600',
      error: 'bg-red-600 dark:bg-red-500 border-red-600 dark:border-red-500 hover:bg-red-700 dark:hover:bg-red-600'
    }
    return `${baseClasses} ${sizeClasses[props.size]} ${checkedClasses[props.variant]}`
  }
  
  const uncheckedClasses = 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600'
  return `${baseClasses} ${sizeClasses[props.size]} ${uncheckedClasses}`
})

const labelClasses = computed(() => {
  if (props.disabled) {
    return 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
  }
  return 'text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300'
})

// Methods
const handleChange = (event) => {
  if (!props.disabled) {
    emit('update:modelValue', event.target.checked)
    emit('change', event.target.checked)
  }
}

const handleClick = () => {
  if (!props.disabled) {
    const newValue = !props.modelValue
    emit('update:modelValue', newValue)
    emit('change', newValue)
  }
}
</script>
