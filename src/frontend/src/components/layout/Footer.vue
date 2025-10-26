<template>
  <footer class="py-8 relative backdrop-blur-xl bg-white/20 dark:bg-gray-900/10 border-t border-white/30 dark:border-gray-700/30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <p :class="['text-sm transition-colors duration-300', isDarkMode ? 'text-gray-400' : 'text-gray-600']">
          © {{ currentYear }} {{ APP_NAME }}
        </p>
        <p :class="['text-xs mt-2 transition-colors duration-300', isDarkMode ? 'text-gray-500' : 'text-gray-500']">
          Weather data provided by <a href="https://open-meteo.com/" target="_blank" rel="noopener" class="text-blue-400 hover:text-blue-300 transition-colors duration-300">Open-Meteo</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useTheme } from '../../composables/useTheme.js'

const APP_NAME = import.meta.env.VITE_APP_NAME || 'ClimaX'

const { isDarkMode } = useTheme()

const currentYear = new Date().getFullYear()
</script>

