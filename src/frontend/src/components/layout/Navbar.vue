<template>
  <header class="sticky top-0 z-50 backdrop-blur-xl bg-white/20 dark:bg-gray-900/20 border-b border-white/20 dark:border-gray-700/30 shadow-2xl shadow-gray-200/30 dark:shadow-gray-900/40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <!-- Logo Section -->
        <div class="flex items-center group cursor-pointer" @click="goToHome">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500/40 to-purple-600/40 rounded-xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
            <div class="relative bg-gradient-to-r from-blue-500/80 to-purple-600/80 backdrop-blur-md p-2 rounded-xl shadow-xl">
              <GlobeAltIcon class="h-8 w-8 text-white drop-shadow-lg" />
            </div>
          </div>
          <div class="ml-4">
            <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {{ APP_NAME }}
            </h1>
            <p class="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase">
              Weather Forecast
            </p>
          </div>
        </div>

        <!-- Navigation Actions -->
        <div class="flex items-center space-x-6">
          <!-- Auth Buttons -->
          <div class="hidden sm:flex items-center space-x-3">
            <button
              @click="goToLogin"
              class="relative px-6 py-2.5 text-sm font-semibold text-gray-800 dark:text-gray-200 bg-white/10 dark:bg-gray-800/10 backdrop-blur-md border border-white/20 dark:border-gray-600/30 rounded-full hover:bg-white/20 dark:hover:bg-gray-800/20 hover:border-white/30 dark:hover:border-gray-500/40 transition-all duration-300 group overflow-hidden shadow-lg"
            >
              <span class="relative z-10">Login</span>
              <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 dark:from-gray-700/30 dark:to-gray-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"></div>
            </button>
            <button
              @click="goToRegister"
              class="relative px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600/80 to-purple-600/80 backdrop-blur-md border border-blue-500/30 rounded-full hover:from-blue-600/90 hover:to-purple-600/90 transition-all duration-300 shadow-xl hover:shadow-2xl group overflow-hidden"
            >
              <span class="relative z-10">Register</span>
              <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
          <!-- Theme Toggle -->
          <div class="relative">
            <button
              @click="toggleTheme"
              class="relative p-3 rounded-full bg-white/10 dark:bg-gray-800/10 backdrop-blur-md border border-white/20 dark:border-gray-600/30 hover:bg-white/20 dark:hover:bg-gray-800/20 hover:border-white/30 dark:hover:border-gray-500/40 transition-all duration-300 group shadow-xl hover:shadow-2xl"
              :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <SunIcon v-if="isDarkMode" class="h-5 w-5 text-yellow-500 group-hover:text-yellow-400 transition-colors duration-300 relative z-10" />
              <MoonIcon v-else class="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300 relative z-10" />
            </button>
          </div>

          <!-- Mobile Menu Button -->
          <div class="sm:hidden">
            <button
              @click="toggleMobileMenu"
              class="p-2 rounded-lg bg-white/10 dark:bg-gray-800/10 backdrop-blur-md border border-white/20 dark:border-gray-600/30 hover:bg-white/20 dark:hover:bg-gray-800/20 hover:border-white/30 dark:hover:border-gray-500/40 transition-all duration-300 shadow-lg"
            >
              <svg class="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="showMobileMenu" class="sm:hidden border-t border-white/20 dark:border-gray-700/30 py-4 backdrop-blur-md">
        <div class="flex flex-col space-y-3">
          <button
            @click="goToLogin"
            class="w-full px-4 py-3 text-left text-gray-800 dark:text-gray-200 bg-white/10 dark:bg-gray-800/10 backdrop-blur-md border border-white/20 dark:border-gray-600/30 rounded-lg hover:bg-white/20 dark:hover:bg-gray-800/20 hover:border-white/30 dark:hover:border-gray-500/40 transition-all duration-300 shadow-lg"
          >
            Login
          </button>
          <button
            @click="goToRegister"
            class="w-full px-4 py-3 text-center text-white bg-gradient-to-r from-blue-600/80 to-purple-600/80 backdrop-blur-md border border-blue-500/30 rounded-lg hover:from-blue-600/90 hover:to-purple-600/90 transition-all duration-300 shadow-xl"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { GlobeAltIcon, SunIcon, MoonIcon } from '@heroicons/vue/24/outline'
import { useTheme } from '../../composables/useTheme.js'

// Environment variables
const APP_NAME = import.meta.env.VITE_APP_NAME || 'ClimaX'

// Router instance
const router = useRouter()

// Theme composable
const { isDarkMode, toggleTheme } = useTheme()

// Mobile menu state
const showMobileMenu = ref(false)

// Navigation methods
const goToHome = () => {
  router.push('/')
}

const goToLogin = () => {
  showMobileMenu.value = false
  router.push('/login')
}

const goToRegister = () => {
  showMobileMenu.value = false
  router.push('/register')
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}
</script>
