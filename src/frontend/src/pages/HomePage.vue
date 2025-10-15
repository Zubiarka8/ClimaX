<script setup>
import { ref, computed, onMounted } from 'vue'
// Import components
import Navbar from '../components/layout/Navbar.vue'
import SearchSection from '../components/weather/SearchSection.vue'
import WeatherDisplay from '../components/weather/WeatherDisplay.vue'
import HeroSection from '../components/sections/HeroSection.vue'
import FeaturesSection from '../components/sections/FeaturesSection.vue'
import InfoSection from '../components/sections/InfoSection.vue'
import Footer from '../components/layout/Footer.vue'

// Import Heroicons
import {
  SunIcon,
  MoonIcon,
  CloudIcon,
  BoltIcon,
  EyeIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

// Environment variables configuration
const OPEN_METEO_API_URL = import.meta.env.VITE_OPEN_METEO_API_URL || 'https://api.open-meteo.com/v1'
const GEOCODING_API_URL = import.meta.env.VITE_GEOCODING_API_URL || 'https://geocoding-api.open-meteo.com/v1/search'
const DEFAULT_CITY = import.meta.env.VITE_DEFAULT_CITY || 'New York'
const IS_DEVELOPMENT = import.meta.env.DEV

// Log configuration in development mode
if (IS_DEVELOPMENT) {
  console.log('🌤️ ClimaX Environment Configuration:', {
    mode: import.meta.env.MODE,
    apiUrl: OPEN_METEO_API_URL,
    version: import.meta.env.VITE_APP_VERSION || '1.0.0'
  })
}

// Reactive data
const isDarkMode = ref(false)
const currentWeather = ref(null)
const forecast = ref([])
const isLoading = ref(false)
const error = ref('')

// Open-Meteo API configuration from environment variables
const API_BASE_URL = OPEN_METEO_API_URL
const GEOCODING_URL = GEOCODING_API_URL

// Weather condition mapping for Heroicons
const getWeatherIcon = (weatherCode) => {
  const icons = {
    0: SunIcon,        // Clear sky
    1: SunIcon,        // Mainly clear
    2: CloudIcon,      // Partly cloudy
    3: CloudIcon,      // Overcast
    45: EyeIcon,       // Fog
    48: EyeIcon,       // Depositing rime fog
    51: CloudIcon,     // Light drizzle (using CloudIcon as alternative)
    53: CloudIcon,     // Moderate drizzle
    55: CloudIcon,     // Dense drizzle
    56: ExclamationTriangleIcon, // Freezing drizzle
    57: ExclamationTriangleIcon, // Dense freezing drizzle
    61: CloudIcon,     // Slight rain (using CloudIcon as alternative)
    63: CloudIcon,     // Moderate rain
    65: CloudIcon,     // Heavy rain
    66: ExclamationTriangleIcon, // Freezing rain
    67: ExclamationTriangleIcon, // Heavy freezing rain
    71: ExclamationTriangleIcon, // Slight snow
    73: ExclamationTriangleIcon, // Moderate snow
    75: ExclamationTriangleIcon, // Heavy snow
    77: ExclamationTriangleIcon, // Snow grains
    80: CloudIcon,     // Slight rain showers
    81: CloudIcon,     // Moderate rain showers
    82: CloudIcon,     // Violent rain showers
    85: ExclamationTriangleIcon, // Slight snow showers
    86: ExclamationTriangleIcon, // Heavy snow showers
    95: BoltIcon,      // Thunderstorm
    96: BoltIcon,      // Thunderstorm with slight hail
    99: BoltIcon       // Thunderstorm with heavy hail
  }
  return icons[weatherCode] || SunIcon
}

const getWeatherCondition = (weatherCode) => {
  const conditions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
  }
  return conditions[weatherCode] || 'Clear sky'
}

// Computed properties
const bgClass = computed(() => 
  isDarkMode.value ? 'bg-gray-900' : 'bg-white'
)

const textClass = computed(() => 
  isDarkMode.value ? 'text-white' : 'text-gray-900'
)

// Function to get coordinates from city name
const getCoordinatesFromCity = async (cityName) => {
  try {
    const response = await fetch(`${GEOCODING_URL}?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`)
    const data = await response.json()
    
    if (data.results && data.results.length > 0) {
      return {
        latitude: data.results[0].latitude,
        longitude: data.results[0].longitude,
        name: data.results[0].name,
        country: data.results[0].country
      }
    }
    throw new Error('City not found')
  } catch (err) {
    throw new Error('Failed to get city coordinates')
  }
}

// Function to fetch weather data from Open-Meteo API
const fetchWeatherData = async (latitude, longitude) => {
  try {
    const response = await fetch(`${API_BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data')
    }
    
    return data
  } catch (err) {
    throw new Error('Failed to fetch weather data')
  }
}

// Function to search weather with coordinates (used by autocomplete)
const searchWeatherWithCoordinates = async (latitude, longitude, locationName) => {
  isLoading.value = true
  error.value = ''
  
  try {
    // Fetch weather data
    const weatherData = await fetchWeatherData(latitude, longitude)
    
    // Process current weather
    const current = weatherData.current
    currentWeather.value = {
      location: locationName,
      temperature: Math.round(current.temperature_2m),
      condition: getWeatherCondition(current.weather_code),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      uvIndex: 6, // Open-Meteo doesn't provide UV in free tier
      icon: getWeatherIcon(current.weather_code)
    }
    
    // Process forecast data
    const daily = weatherData.daily
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    
    forecast.value = daily.time.slice(0, 5).map((date, index) => {
      const day = new Date(date)
      const dayName = index === 0 ? 'Today' : dayNames[day.getDay()]
      
      return {
        day: dayName,
        temp: Math.round(daily.temperature_2m_max[index]),
        condition: getWeatherCondition(daily.weather_code[index]),
        icon: getWeatherIcon(daily.weather_code[index])
      }
    })
    
  } catch (err) {
    error.value = err.message || 'Failed to fetch weather data'
    console.error('Weather API Error:', err)
  } finally {
    isLoading.value = false
  }
}

// Event handlers for components
const handleSearch = async (query) => {
  if (!query.trim()) return
  
  isLoading.value = true
  error.value = ''
  
  try {
    // Get coordinates from city name
    const location = await getCoordinatesFromCity(query.trim())
    
    // Search with coordinates
    await searchWeatherWithCoordinates(location.latitude, location.longitude, `${location.name}, ${location.country}`)
    
  } catch (err) {
    error.value = err.message || 'Failed to fetch weather data'
    console.error('Weather API Error:', err)
  } finally {
    isLoading.value = false
  }
}

const handleCurrentLocation = async () => {
  if (!navigator.geolocation) {
    error.value = 'Geolocation is not supported by this browser'
    return
  }
  
  isLoading.value = true
  error.value = ''
  
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords
        
        // Fetch weather data directly with coordinates
        const weatherData = await fetchWeatherData(latitude, longitude)
        
        // Get city name from reverse geocoding
        const reverseGeocodeResponse = await fetch(`${GEOCODING_URL}?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`)
        const reverseGeocodeData = await reverseGeocodeResponse.json()
        
        const locationName = reverseGeocodeData.results && reverseGeocodeData.results.length > 0 
          ? `${reverseGeocodeData.results[0].name}, ${reverseGeocodeData.results[0].country}`
          : `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
        
        // Process current weather
        const current = weatherData.current
        currentWeather.value = {
          location: locationName,
          temperature: Math.round(current.temperature_2m),
          condition: getWeatherCondition(current.weather_code),
          humidity: current.relative_humidity_2m,
          windSpeed: Math.round(current.wind_speed_10m),
          uvIndex: 6, // Open-Meteo doesn't provide UV in free tier
          icon: getWeatherIcon(current.weather_code)
        }
        
        // Process forecast data
        const daily = weatherData.daily
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        
        forecast.value = daily.time.slice(0, 5).map((date, index) => {
          const day = new Date(date)
          const dayName = index === 0 ? 'Today' : dayNames[day.getDay()]
          
          return {
            day: dayName,
            temp: Math.round(daily.temperature_2m_max[index]),
            condition: getWeatherCondition(daily.weather_code[index]),
            icon: getWeatherIcon(daily.weather_code[index])
          }
        })
        
      } catch (err) {
        error.value = 'Failed to get weather data for your location'
        console.error('Location Weather Error:', err)
      } finally {
        isLoading.value = false
      }
    },
    (err) => {
      isLoading.value = false
      switch (err.code) {
        case err.PERMISSION_DENIED:
          error.value = 'Location access denied by user'
          break
        case err.POSITION_UNAVAILABLE:
          error.value = 'Location information is unavailable'
          break
        case err.TIMEOUT:
          error.value = 'Location request timed out'
          break
        default:
          error.value = 'An unknown error occurred while getting location'
          break
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    }
  )
}

const handleSuggestionSelected = (suggestion) => {
  // Search for weather data using the selected suggestion
  searchWeatherWithCoordinates(suggestion.latitude, suggestion.longitude, suggestion.displayName)
}

const handleSearchCity = async (cityName) => {
  await handleSearch(cityName)
}

// Lifecycle
onMounted(async () => {
  // Load saved theme
  const savedTheme = localStorage.getItem('theme')
  isDarkMode.value = savedTheme === 'dark'
  
  // Load default weather data from environment configuration
  try {
    isLoading.value = true
    const location = await getCoordinatesFromCity(DEFAULT_CITY)
    const weatherData = await fetchWeatherData(location.latitude, location.longitude)
    
    // Process current weather
    const current = weatherData.current
    currentWeather.value = {
      location: `${location.name}, ${location.country}`,
      temperature: Math.round(current.temperature_2m),
      condition: getWeatherCondition(current.weather_code),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      uvIndex: 6, // Open-Meteo doesn't provide UV in free tier
      icon: getWeatherIcon(current.weather_code)
    }
    
    // Process forecast data
    const daily = weatherData.daily
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    
    forecast.value = daily.time.slice(0, 5).map((date, index) => {
      const day = new Date(date)
      const dayName = index === 0 ? 'Today' : dayNames[day.getDay()]
      
      return {
        day: dayName,
        temp: Math.round(daily.temperature_2m_max[index]),
        condition: getWeatherCondition(daily.weather_code[index]),
        icon: getWeatherIcon(daily.weather_code[index])
      }
    })
    
  } catch (err) {
    console.error('Failed to load default weather data:', err)
    error.value = 'Failed to load weather data'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div :class="['min-h-screen transition-colors duration-300', bgClass, textClass]">
    <!-- Navbar -->
    <Navbar />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Search Section -->
      <SearchSection 
        :is-loading="isLoading"
        :error="error"
        @search="handleSearch"
        @current-location="handleCurrentLocation"
        @suggestion-selected="handleSuggestionSelected"
      />

      <!-- Hero Section -->
      <HeroSection 
        :is-dark-mode="isDarkMode"
        @search-city="handleSearchCity"
      />

      <!-- Weather Display -->
      <WeatherDisplay 
        :current-weather="currentWeather"
        :forecast="forecast"
        :is-dark-mode="isDarkMode"
      />

      <!-- Features Section -->
      <FeaturesSection 
        :is-dark-mode="isDarkMode"
      />

      <!-- Info Section -->
      <InfoSection 
        :is-dark-mode="isDarkMode"
      />
    </main>

    <!-- Footer -->
    <Footer 
      :is-dark-mode="isDarkMode"
    />
  </div>
</template>

<style scoped>
/* Additional custom styles if needed */
</style>