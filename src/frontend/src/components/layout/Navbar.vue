<template>
  <header class="bg-white fixed top-0 left-0 right-0 z-50 dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <GlobeAltIcon class="h-8 w-8 text-primary-blue mr-2" />
          <h1 class="text-2xl font-bold text-primary-blue">{{ APP_NAME }}</h1>
          <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">Weather Forecast</span>
        </div>
        <div class="flex items-center space-x-4">
          <!-- Auth Buttons -->
          <div class="flex items-center space-x-2">
            <button
              @click="goToLogin"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Login
            </button>
            <button
              @click="goToRegister"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-blue border border-transparent rounded-lg hover:bg-dark-blue transition-colors"
            >
              Register
            </button>
          </div>
          <!-- Theme Toggle -->
          <button
            @click="toggleTheme"
            class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <SunIcon v-if="isDarkMode" class="h-5 w-5 text-yellow-500" />
            <MoonIcon v-else class="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { GlobeAltIcon, SunIcon, MoonIcon } from '@heroicons/vue/24/outline'

// Environment variables
const APP_NAME = import.meta.env.VITE_APP_NAME || 'ClimaX'

// Router instance
const router = useRouter()

// Reactive data
const isDarkMode = ref(false)

// Methods
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
}

// Navigation methods
const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}

// Lifecycle
onMounted(() => {
  // Load saved theme
  const savedTheme = localStorage.getItem('theme')
  isDarkMode.value = savedTheme === 'dark'
})
</script>

