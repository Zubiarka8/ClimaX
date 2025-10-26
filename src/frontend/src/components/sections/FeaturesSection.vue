<template>
  <div class="mt-16">
    <h3 :class="['text-2xl font-bold mb-6 text-center transition-colors duration-300', textClass]">
      Why Choose {{ APP_NAME }}?
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="relative backdrop-blur-xl bg-white/30 dark:bg-gray-900/10 border border-white/40 dark:border-gray-700/30 rounded-2xl p-6 text-center shadow-2xl shadow-gray-200/30 dark:shadow-gray-900/30 hover:shadow-3xl hover:shadow-gray-200/40 dark:hover:shadow-gray-900/40 transition-all duration-300 group">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <MapPinIcon class="h-12 w-12 text-blue-500 mx-auto mb-4 relative z-10" />
        <h4 :class="['text-xl font-semibold mb-2 transition-colors duration-300 relative z-10', textClass]">
          Precise Location
        </h4>
        <p :class="['transition-colors duration-300 relative z-10', isDarkMode ? 'text-gray-300' : 'text-gray-600']">
          Get accurate weather data for any location with GPS precision
        </p>
      </div>
      
      <div class="relative backdrop-blur-xl bg-white/30 dark:bg-gray-900/10 border border-white/40 dark:border-gray-700/30 rounded-2xl p-6 text-center shadow-2xl shadow-gray-200/30 dark:shadow-gray-900/30 hover:shadow-3xl hover:shadow-gray-200/40 dark:hover:shadow-gray-900/40 transition-all duration-300 group">
        <div class="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <ClockIcon class="h-12 w-12 text-green-500 mx-auto mb-4 relative z-10" />
        <h4 :class="['text-xl font-semibold mb-2 transition-colors duration-300 relative z-10', textClass]">
          Extended Forecast
        </h4>
        <p :class="['transition-colors duration-300 relative z-10', isDarkMode ? 'text-gray-300' : 'text-gray-600']">
          Plan ahead with detailed 5-day weather forecasts
        </p>
      </div>
      
      <div class="relative backdrop-blur-xl bg-white/30 dark:bg-gray-900/10 border border-white/40 dark:border-gray-700/30 rounded-2xl p-6 text-center shadow-2xl shadow-gray-200/30 dark:shadow-gray-900/30 hover:shadow-3xl hover:shadow-gray-200/40 dark:hover:shadow-gray-900/40 transition-all duration-300 group">
        <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <DevicePhoneMobileIcon class="h-12 w-12 text-purple-500 mx-auto mb-4 relative z-10" />
        <h4 :class="['text-xl font-semibold mb-2 transition-colors duration-300 relative z-10', textClass]">
          Mobile Friendly
        </h4>
        <p :class="['transition-colors duration-300 relative z-10', isDarkMode ? 'text-gray-300' : 'text-gray-600']">
          Beautiful interface with light and dark theme support
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { MapPinIcon, ClockIcon, DevicePhoneMobileIcon } from '@heroicons/vue/24/outline'
import { useTheme } from '../../composables/useTheme.js'

const APP_NAME = import.meta.env.VITE_APP_NAME || 'ClimaX'

const { isDarkMode, textClass, cardClass } = useTheme()
</script>

