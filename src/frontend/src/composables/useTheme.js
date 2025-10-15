import { ref, computed, watch } from 'vue'

// Global theme state
const isDarkMode = ref(false)

// Initialize theme from localStorage
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark'
  } else {
    isDarkMode.value = prefersDark
  }
  
  // Apply theme to document
  applyTheme()
}

// Apply theme to document
const applyTheme = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Toggle theme
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
  applyTheme()
}

// Set theme
const setTheme = (dark) => {
  isDarkMode.value = dark
  localStorage.setItem('theme', dark ? 'dark' : 'light')
  applyTheme()
}

// Watch for theme changes and apply to document
watch(isDarkMode, () => {
  applyTheme()
})

// Computed properties
const themeClasses = computed(() => ({
  'dark': isDarkMode.value,
  'light': !isDarkMode.value
}))

const bgClass = computed(() => 
  isDarkMode.value ? 'bg-gray-900' : 'bg-white'
)

const textClass = computed(() => 
  isDarkMode.value ? 'text-white' : 'text-gray-900'
)

const cardClass = computed(() => 
  isDarkMode.value 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200'
)

// Composable function
export function useTheme() {
  return {
    isDarkMode,
    themeClasses,
    bgClass,
    textClass,
    cardClass,
    toggleTheme,
    setTheme,
    initializeTheme
  }
}

// Initialize theme on module load
initializeTheme()