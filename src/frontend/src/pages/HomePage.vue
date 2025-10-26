<script setup>
import { onMounted } from 'vue'
// Import components
import Navbar from '../components/layout/Navbar.vue'
import SearchSection from '../components/weather/SearchSection.vue'
import WeatherDisplay from '../components/weather/WeatherDisplay.vue'
import HeroSection from '../components/sections/HeroSection.vue'
import FeaturesSection from '../components/sections/FeaturesSection.vue'
import InfoSection from '../components/sections/InfoSection.vue'
import Footer from '../components/layout/Footer.vue'
// Import composables
import { useTheme } from '../composables/useTheme.js'
import { useWeather } from '../composables/useWeather.js'

// Environment variables configuration
const IS_DEVELOPMENT = import.meta.env.DEV

// Log configuration in development mode
if (IS_DEVELOPMENT) {
  console.log('🌤️ ClimaX Environment Configuration:', {
    mode: import.meta.env.MODE,
    version: import.meta.env.VITE_APP_VERSION || '1.0.0'
  })
}

const { bgClass, textClass } = useTheme()

// Use the weather composable to handle all weather state
const {
  currentWeather,
  forecast,
  isLoading,
  error,
  searchWeatherByCity,
  getCurrentLocationWeather,
  loadDefaultWeather
} = useWeather()

// Event handlers para los componentes
const handleSearch = async (query) => {
  await searchWeatherByCity(query)
}

const handleCurrentLocation = async () => {
  await getCurrentLocationWeather()
}

// No longer need to handle automatically selected suggestions
// User must press "Search" to execute the search

const handleSearchCity = async (cityName) => {
  await searchWeatherByCity(cityName)
}

// Lifecycle
onMounted(async () => {
  // Load default weather data
  await loadDefaultWeather()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-black dark:via-gray-900 dark:to-black transition-colors duration-300">
    <!-- Navbar -->
    <Navbar />
    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
      <!-- Search Section -->
      <SearchSection
        :is-loading="isLoading"
        :error="error"
        @search="handleSearch"
        @current-location="handleCurrentLocation"
      />
      <!-- Hero Section -->
      <HeroSection
        @search-city="handleSearchCity"
      />
      <!-- Weather Display -->
      <WeatherDisplay
        :current-weather="currentWeather"
        :forecast="forecast"
      />
      <!-- Features Section -->
      <FeaturesSection />
      <!-- Info Section -->
      <InfoSection />
    </main>
    <!-- Footer -->
    <Footer />
  </div>
</template>