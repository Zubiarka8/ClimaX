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
          <!-- Auth Buttons - Show when user is NOT authenticated -->
          <div v-if="!isAuthenticated" class="hidden sm:flex items-center space-x-3">
            <button
              @click="goToLogin"
              class="px-6 py-2.5 bg-white/10 dark:bg-gray-800/20 backdrop-blur-md border border-white/20 dark:border-gray-700/30 rounded-full text-gray-700 dark:text-gray-300 font-medium hover:bg-white/20 dark:hover:bg-gray-800/30 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Login
            </button>
            <button
              @click="goToRegister"
              class="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Register
            </button>
          </div>
          <!-- User Menu - Show when user IS authenticated -->
          <div v-if="isAuthenticated" class="hidden sm:flex items-center space-x-4">
            <!-- User Profile Dropdown -->
            <div class="relative group">
              <button
                class="flex items-center space-x-3 px-3 py-2 rounded-full bg-white/10 dark:bg-gray-800/20 backdrop-blur-md border border-white/20 dark:border-gray-700/30 hover:bg-white/20 dark:hover:bg-gray-800/30 transition-all duration-300 group"
              >
                <!-- Avatar -->
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/20 dark:ring-gray-600/30">
                  <span class="text-white text-sm font-bold">
                    {{ userInitials }}
                  </span>
                </div>
                <!-- User Info -->
                <div class="flex flex-col items-start">
                  <span class="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                    {{ user?.fullname || user?.username || 'User' }}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                    {{ user?.email }}
                  </span>
                </div>
                <!-- Dropdown Arrow -->
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <!-- Dropdown Menu -->
              <div class="absolute right-0 mt-3 w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform translate-y-2 group-hover:translate-y-0">
                <div class="py-3">
                  <!-- Menu Items -->
                  <div class="py-2">
                    <button
                      @click="goToProfile"
                      class="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 transition-all duration-200 flex items-center space-x-3 group/item"
                    >
                      <svg class="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover/item:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Profile</span>
                    </button>
                    <button
                      @click="goToSettings"
                      class="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 transition-all duration-200 flex items-center space-x-3 group/item"
                    >
                      <svg class="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover/item:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Settings</span>
                    </button>
                  </div>
                  <!-- Divider -->
                  <div class="border-t border-gray-200/50 dark:border-gray-700/50 my-2"></div>
                  <!-- Logout -->
                  <button
                    @click="handleLogout"
                    class="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/20 transition-all duration-200 flex items-center space-x-3 group/item"
                  >
                    <svg class="w-4 h-4 text-red-500 dark:text-red-400 group-hover/item:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- Theme Toggle -->
          <button
            @click="toggleTheme"
            class="p-3 bg-white/10 dark:bg-gray-800/20 backdrop-blur-md border border-white/20 dark:border-gray-700/30 rounded-full hover:bg-white/20 dark:hover:bg-gray-800/30 transition-all duration-300 shadow-lg hover:shadow-xl"
            :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <SunIcon v-if="isDarkMode" class="h-5 w-5 text-yellow-500 transition-transform duration-300" />
            <MoonIcon v-else class="h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform duration-300" />
          </button>

          <!-- Mobile Menu Button -->
          <div class="sm:hidden">
            <button
              @click="toggleMobileMenu"
              class="p-2 bg-white/10 dark:bg-gray-800/20 backdrop-blur-md border border-white/20 dark:border-gray-700/30 rounded-lg hover:bg-white/20 dark:hover:bg-gray-800/30 transition-all duration-300 shadow-lg"
            >
              <svg class="h-6 w-6 text-gray-600 dark:text-gray-400 transition-transform duration-300" :class="{ 'rotate-90': showMobileMenu }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="showMobileMenu" class="sm:hidden border-t border-white/20 dark:border-gray-700/30 py-4 backdrop-blur-md">
        <div class="flex flex-col space-y-3">
          <!-- Show auth buttons when NOT authenticated -->
          <template v-if="!isAuthenticated">
            <button
              @click="goToLogin"
              class="w-full px-4 py-3 bg-white/10 dark:bg-gray-800/20 backdrop-blur-md border border-white/20 dark:border-gray-700/30 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-white/20 dark:hover:bg-gray-800/30 transition-all duration-300 text-left shadow-lg"
            >
              Login
            </button>
            <button
              @click="goToRegister"
              class="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Register
            </button>
          </template>

          <!-- Show user menu when authenticated -->
          <template v-else>
            <!-- User Info Card -->
            <div class="px-4 py-4 bg-white/10 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-lg">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/20 dark:ring-gray-600/30">
                  <span class="text-white text-base font-bold">
                    {{ userInitials }}
                  </span>
                </div>
                <div class="flex-1">
                  <p class="text-base font-semibold text-gray-900 dark:text-white">{{ user?.fullname || 'User' }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ user?.email }}</p>
                </div>
              </div>
            </div>

            <!-- User Actions -->
            <div class="space-y-2">
              <button
                @click="goToProfile"
                class="w-full flex items-center space-x-3 px-4 py-3 bg-white/10 dark:bg-gray-800/20 backdrop-blur-md rounded-xl border border-white/20 dark:border-gray-700/30 hover:bg-white/20 dark:hover:bg-gray-800/30 transition-all duration-200 text-left group"
              >
                <svg class="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span class="text-gray-700 dark:text-gray-300 font-medium">Profile</span>
              </button>
              
              <button
                @click="goToSettings"
                class="w-full flex items-center space-x-3 px-4 py-3 bg-white/10 dark:bg-gray-800/20 backdrop-blur-md rounded-xl border border-white/20 dark:border-gray-700/30 hover:bg-white/20 dark:hover:bg-gray-800/30 transition-all duration-200 text-left group"
              >
                <svg class="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="text-gray-700 dark:text-gray-300 font-medium">Settings</span>
              </button>
              
              <button
                @click="handleLogout"
                class="w-full flex items-center space-x-3 px-4 py-3 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-md rounded-xl border border-red-200/50 dark:border-red-800/30 hover:bg-red-100/80 dark:hover:bg-red-900/30 transition-all duration-200 text-left group"
              >
                <svg class="w-5 h-5 text-red-500 dark:text-red-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span class="text-red-600 dark:text-red-400 font-medium">Logout</span>
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { GlobeAltIcon, SunIcon, MoonIcon } from '@heroicons/vue/24/outline'
import { useTheme } from '../../composables/useTheme.js'
import { useAuthStore } from '../../stores/authStore.js'
import Button from '../ui/Button.vue'

// Environment variables
const APP_NAME = import.meta.env.VITE_APP_NAME || 'ClimaX'

// Router instance
const router = useRouter()

// Theme composable
const { isDarkMode, toggleTheme } = useTheme()

// Auth store
const { user, isAuthenticated, logout } = useAuthStore()

// Mobile menu state
const showMobileMenu = ref(false)

// Computed properties
const userInitials = computed(() => {
  if (!user.value) return 'U'
  const name = user.value.fullname || user.value.username || user.value.email || 'User'
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

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

const goToProfile = () => {
  showMobileMenu.value = false
  router.push('/profile')
}

const goToSettings = () => {
  showMobileMenu.value = false
  router.push('/settings')
}

const handleLogout = () => {
  showMobileMenu.value = false
  logout()
  router.push('/')
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}
</script>
