<template>
  <component
    :is="tag"
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <!-- Loading spinner -->
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>

    <!-- Icon (left) -->
    <component
      v-if="icon && !loading"
      :is="icon"
      :class="iconClasses"
    />

    <!-- Button content -->
    <span v-if="$slots.default" :class="textClasses">
      <slot />
    </span>

    <!-- Icon (right) -->
    <component
      v-if="iconRight && !loading"
      :is="iconRight"
      :class="iconRightClasses"
    />
  </component>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  // Button type
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  },
  // HTML tag to render
  tag: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'a', 'router-link'].includes(value)
  },
  // Button variant
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => [
      'primary', 'secondary', 'success', 'danger', 'warning', 'info',
      'outline', 'ghost', 'glass', 'gradient'
    ].includes(value)
  },
  // Button size
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  // Button state
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  // Icons
  icon: {
    type: [String, Object],
    default: null
  },
  iconRight: {
    type: [String, Object],
    default: null
  },
  // Custom classes
  customClass: {
    type: String,
    default: ''
  },
  // Full width
  fullWidth: {
    type: Boolean,
    default: false
  },
  // Rounded corners
  rounded: {
    type: String,
    default: 'md',
    validator: (value) => ['none', 'sm', 'md', 'lg', 'xl', 'full'].includes(value)
  }
})

// Emits
const emit = defineEmits(['click'])

const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'transition-all',
    'duration-300',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'relative',
    'overflow-hidden'
  ]
  const sizeClasses = {
    xs: ['text-xs', 'px-2', 'py-1'],
    sm: ['text-sm', 'px-3', 'py-1.5'],
    md: ['text-sm', 'px-4', 'py-2'],
    lg: ['text-base', 'px-6', 'py-3'],
    xl: ['text-lg', 'px-8', 'py-4']
  }

  // Rounded classes
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  }
  // Variant classes
  const variantClasses = {
    primary: [
      'bg-blue-600',
      'text-white',
      'border-transparent',
      'hover:bg-blue-700',
      'focus:ring-blue-500',
      'shadow-lg',
      'hover:shadow-xl'
    ],
    secondary: [
      'bg-gray-600',
      'text-white',
      'border-transparent',
      'hover:bg-gray-700',
      'focus:ring-gray-500',
      'shadow-lg',
      'hover:shadow-xl'
    ],
    success: [
      'bg-green-600',
      'text-white',
      'border-transparent',
      'hover:bg-green-700',
      'focus:ring-green-500',
      'shadow-lg',
      'hover:shadow-xl'
    ],
    danger: [
      'bg-red-600',
      'text-white',
      'border-transparent',
      'hover:bg-red-700',
      'focus:ring-red-500',
      'shadow-lg',
      'hover:shadow-xl'
    ],
    warning: [
      'bg-yellow-600',
      'text-white',
      'border-transparent',
      'hover:bg-yellow-700',
      'focus:ring-yellow-500',
      'shadow-lg',
      'hover:shadow-xl'
    ],
    info: [
      'bg-cyan-600',
      'text-white',
      'border-transparent',
      'hover:bg-cyan-700',
      'focus:ring-cyan-500',
      'shadow-lg',
      'hover:shadow-xl'
    ],
    outline: [
      'bg-transparent',
      'text-gray-700',
      'dark:text-gray-300',
      'border-gray-300',
      'dark:border-gray-600',
      'hover:bg-gray-50',
      'dark:hover:bg-gray-800',
      'focus:ring-gray-500',
      'border'
    ],
    ghost: [
      'bg-transparent',
      'text-gray-700',
      'dark:text-gray-300',
      'border-transparent',
      'hover:bg-gray-100',
      'dark:hover:bg-gray-800',
      'focus:ring-gray-500'
    ],
    glass: [
      'backdrop-blur-xl',
      'bg-white/30',
      'dark:bg-gray-800/30',
      'border-white/40',
      'dark:border-gray-600/30',
      'text-gray-800',
      'dark:text-white',
      'hover:bg-white/40',
      'dark:hover:bg-gray-800/40',
      'focus:ring-blue-400/50',
      'shadow-xl',
      'hover:shadow-2xl',
      'border'
    ],
    gradient: [
      'bg-gradient-to-r',
      'from-blue-600',
      'to-purple-600',
      'text-white',
      'border-transparent',
      'hover:from-blue-700',
      'hover:to-purple-700',
      'focus:ring-blue-500',
      'shadow-xl',
      'hover:shadow-2xl'
    ]
  }

  // Combine all classes
  const classes = [
    ...baseClasses,
    ...sizeClasses[props.size],
    roundedClasses[props.rounded],
    ...variantClasses[props.variant],
    props.fullWidth ? 'w-full' : '',
    props.customClass
  ].filter(Boolean)

  return classes.join(' ')
})

const iconClasses = computed(() => {
  const baseIconClasses = ['h-4', 'w-4']
  if (props.icon) {
    return [
      ...baseIconClasses,
      props.size === 'xs' ? 'mr-1' : 'mr-2'
    ].join(' ')
  }
  return baseIconClasses.join(' ')
})

const iconRightClasses = computed(() => {
  const baseIconClasses = ['h-4', 'w-4']
  if (props.iconRight) {
    return [
      ...baseIconClasses,
      props.size === 'xs' ? 'ml-1' : 'ml-2'
    ].join(' ')
  }
  return baseIconClasses.join(' ')
})

const textClasses = computed(() => {
  if (props.icon && !props.loading) {
    return props.size === 'xs' ? 'ml-1' : 'ml-2'
  }
  if (props.iconRight && !props.loading) {
    return props.size === 'xs' ? 'mr-1' : 'mr-2'
  }
  return ''
})

// Methods
const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>
