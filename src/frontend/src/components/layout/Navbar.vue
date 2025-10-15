<template>
  <header class="fixed w-full top-0 z-50 backdrop-blur-2xl bg-white/10 dark:bg-gray-900/10 border-b border-white/20 dark:border-gray-700/30 shadow-2xl shadow-gray-200/20 dark:shadow-gray-900/30">
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
            <Button
              @click="goToLogin"
              variant="glass"
              size="md"
              rounded="full"
              custom-class="px-6 py-2.5"
            >
              Login
            </Button>
            <Button
              @click="goToRegister"
              variant="gradient"
              size="md"
              rounded="full"
              custom-class="px-6 py-2.5"
            >
              Register
            </Button>
          </div>
          <!-- Theme Toggle -->
          <Button
            @click="toggleTheme"
            variant="glass"
            size="md"
            rounded="full"
            custom-class="p-3"
            :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <SunIcon v-if="isDarkMode" class="h-5 w-5 text-yellow-500" />
            <MoonIcon v-else class="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </Button>

          <!-- Mobile Menu Button -->
          <div class="sm:hidden">
            <Button
              @click="toggleMobileMenu"
              variant="glass"
              size="md"
              rounded="lg"
              custom-class="p-2"
            >
              <svg class="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="showMobileMenu" class="sm:hidden border-t border-white/20 dark:border-gray-700/30 py-4 backdrop-blur-md">
        <div class="flex flex-col space-y-3">
          <Button
            @click="goToLogin"
            variant="glass"
            size="lg"
            full-width
            rounded="lg"
            custom-class="px-4 py-3 text-left"
          >
            Login
          </Button>
          <Button
            @click="goToRegister"
            variant="gradient"
            size="lg"
            full-width
            rounded="lg"
            custom-class="px-4 py-3"
          >
            Register
          </Button>
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
import Button from '../ui/Button.vue'

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
