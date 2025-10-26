import { ref, computed, watch } from 'vue'

// Possible theme values: 'light', 'dark', 'system'
const theme = ref('system')

// Store the media query listener function to allow cleanup
let systemPreferenceListener = null

// Get system preference
const getSystemPreference = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

// Get effective theme (applies system preference)
const getEffectiveTheme = () => {
  if (theme.value === 'system') {
    return getSystemPreference() ? 'dark' : 'light'
  }
  return theme.value
}

// Manage system preference listener
const updateSystemPreferenceListener = () => {
  // Remove existing listener if it exists
  if (systemPreferenceListener) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.removeEventListener('change', systemPreferenceListener)
    systemPreferenceListener = null
  }
  
  // Add new listener if theme is 'system'
  if (theme.value === 'system') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    systemPreferenceListener = applyTheme
    mediaQuery.addEventListener('change', systemPreferenceListener)
  }
}

// Initialize theme from localStorage
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  
  if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
    theme.value = savedTheme
  } else {
    theme.value = 'system'
  }
  
  // Apply theme to document
  applyTheme()
  
  // Manage system preference listener
  updateSystemPreferenceListener()
}

// Apply theme to document
const applyTheme = () => {
  const effectiveTheme = getEffectiveTheme()
  
  if (effectiveTheme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Cycle through themes: system -> light -> dark -> system
const cycleTheme = () => {
  if (theme.value === 'system') {
    theme.value = 'light'
  } else if (theme.value === 'light') {
    theme.value = 'dark'
  } else {
    theme.value = 'system'
  }
  
  localStorage.setItem('theme', theme.value)
  
  // Update system preference listener
  updateSystemPreferenceListener()
  
  applyTheme()
}

// Set theme directly
const setTheme = (newTheme) => {
  if (!['light', 'dark', 'system'].includes(newTheme)) {
    console.warn(`Invalid theme: ${newTheme}. Using 'system' instead.`)
    newTheme = 'system'
  }
  
  theme.value = newTheme
  localStorage.setItem('theme', newTheme)
  
  // Update system preference listener
  updateSystemPreferenceListener()
  
  applyTheme()
}

// Legacy support: Toggle between light and dark (for backwards compatibility)
const toggleTheme = () => {
  const effectiveTheme = getEffectiveTheme()
  
  if (effectiveTheme === 'dark') {
    setTheme('light')
  } else {
    setTheme('dark')
  }
}

// Watch for theme changes and apply to document
watch(theme, () => {
  applyTheme()
})

// Computed properties
const isDarkMode = computed(() => getEffectiveTheme() === 'dark')

const themeClasses = computed(() => ({
  'dark': isDarkMode.value,
  'light': !isDarkMode.value
}))

const bgClass = computed(() => 
  isDarkMode.value ? 'bg-black' : 'bg-white'
)

const textClass = computed(() => 
  isDarkMode.value ? 'text-white' : 'text-gray-900'
)

const cardClass = computed(() => 
  isDarkMode.value 
    ? 'bg-gray-900 border-gray-800' 
    : 'bg-white border-gray-200'
)

const currentTheme = computed(() => theme.value)
const currentEffectiveTheme = computed(() => getEffectiveTheme())

// Composable function
export function useTheme() {
  return {
    theme: currentTheme,
    effectiveTheme: currentEffectiveTheme,
    isDarkMode,
    themeClasses,
    bgClass,
    textClass,
    cardClass,
    cycleTheme,
    toggleTheme,
    setTheme,
    initializeTheme
  }
}

// Initialize theme on module load
initializeTheme()