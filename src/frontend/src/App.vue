<script setup>
import { ref, computed, onMounted } from 'vue'
// Environment variables configuration
const OPEN_METEO_API_URL = import.meta.env.VITE_OPEN_METEO_API_URL || 'https://api.open-meteo.com/v1'
const GEOCODING_API_URL = import.meta.env.VITE_GEOCODING_API_URL || 'https://geocoding-api.open-meteo.com/v1/search'
const APP_NAME = import.meta.env.VITE_APP_NAME || 'ClimaX'
const DEFAULT_CITY = import.meta.env.VITE_DEFAULT_CITY || 'New York'
const DEFAULT_FORECAST_DAYS = parseInt(import.meta.env.VITE_DEFAULT_FORECAST_DAYS) || 5
const ENABLE_DARK_MODE = import.meta.env.VITE_ENABLE_DARK_MODE === 'true'
const ENABLE_AUTOCOMPLETE = import.meta.env.VITE_ENABLE_AUTOCOMPLETE === 'true'
const ENABLE_GEOLOCATION = import.meta.env.VITE_ENABLE_GEOLOCATION === 'true'
const API_RATE_LIMIT = parseInt(import.meta.env.VITE_API_RATE_LIMIT) || 60
const CACHE_DURATION = parseInt(import.meta.env.VITE_CACHE_DURATION) || 10
const IS_DEVELOPMENT = import.meta.env.DEV

// Log configuration in development mode
if (IS_DEVELOPMENT) {
  console.log('🌤️ ClimaX Environment Configuration:', {
    mode: import.meta.env.MODE,
    apiUrl: OPEN_METEO_API_URL,
    appName: APP_NAME,
    version: import.meta.env.VITE_APP_VERSION || '1.0.0'
  })
}

// Import Heroicons
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  SunIcon,
  MoonIcon,
  CloudIcon,
  BoltIcon,
  EyeIcon,
  AdjustmentsHorizontalIcon,
  GlobeAltIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  BeakerIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

// Reactive data
const isDarkMode = ref(false)
const searchQuery = ref('')
const currentWeather = ref(null)
const forecast = ref([])
const isLoading = ref(false)
const error = ref('')

// Autocomplete functionality
const autocompleteSuggestions = ref([])
const showAutocomplete = ref(false)
const selectedSuggestionIndex = ref(-1)
const isSearching = ref(false)

// Popular cities for quick search
const popularCities = ref([
  'New York', 'London', 'Tokyo', 'Paris', 'Madrid', 'Barcelona', 
  'Rome', 'Berlin', 'Amsterdam', 'Sydney', 'Los Angeles', 'Chicago'
])

// Get current year for copyright
const currentYear = new Date().getFullYear()

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

// Methods
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
}

// Debounce function to limit API calls
let debounceTimer = null
const debounce = (func, delay) => {
  return (...args) => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => func.apply(null, args), delay)
  }
}

// Function to get autocomplete suggestions
const getAutocompleteSuggestions = async (query, count = 5) => {
  if (!query || query.length < 2) {

    autocompleteSuggestions.value = []
    showAutocomplete.value = false
    return
  }

  try {
    isSearching.value = true
    const response = await fetch(`${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=${count}&language=en&format=json`)
    const data = await response.json()
    
    if (data.results && data.results.length > 0) {
      autocompleteSuggestions.value = data.results.map(result => ({
        name: result.name,
        country: result.country,
        admin1: result.admin1, // State/Province
        latitude: result.latitude,
        longitude: result.longitude,
        displayName: `${result.name}${result.admin1 ? ', ' + result.admin1 : ''}, ${result.country}`
      }))
      showAutocomplete.value = true
      selectedSuggestionIndex.value = -1
    } else {
      autocompleteSuggestions.value = []
      showAutocomplete.value = false
    }
  } catch (err) {
    console.error('Autocomplete error:', err)
    autocompleteSuggestions.value = []
    showAutocomplete.value = false
  } finally {
    isSearching.value = false
  }
}

// Debounced autocomplete function
const debouncedAutocomplete = debounce(getAutocompleteSuggestions, 300)

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

// Function to select a suggestion from autocomplete
const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion.displayName
  showAutocomplete.value = false
  selectedSuggestionIndex.value = -1
  
  // Search for weather data using the selected suggestion
  searchWeatherWithCoordinates(suggestion.latitude, suggestion.longitude, suggestion.displayName)
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

// Function to handle keyboard navigation in autocomplete
const handleKeyDown = (event) => {
  if (!showAutocomplete.value || autocompleteSuggestions.value.length === 0) {
    if (event.key === 'Enter') {
      searchWeather()
    }
    return
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedSuggestionIndex.value = Math.min(selectedSuggestionIndex.value + 1, autocompleteSuggestions.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedSuggestionIndex.value = Math.max(selectedSuggestionIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (selectedSuggestionIndex.value >= 0) {
        selectSuggestion(autocompleteSuggestions.value[selectedSuggestionIndex.value])
      } else {
        searchWeather()
      }
      break
    case 'Escape':
      showAutocomplete.value = false
      selectedSuggestionIndex.value = -1
      break
  }
}

// Function to handle input changes for autocomplete
const handleInputChange = (event) => {
  const value = event.target.value
  searchQuery.value = value
  
  if (value.length >= 2) {
    debouncedAutocomplete(value, 5)
  } else {
    showAutocomplete.value = false
    autocompleteSuggestions.value = []
  }
}

const searchWeather = async () => {
  if (!searchQuery.value.trim()) return
  
  // Hide autocomplete when searching
  showAutocomplete.value = false
  
  isLoading.value = true
  error.value = ''
  
  try {
    // Get coordinates from city name
    const location = await getCoordinatesFromCity(searchQuery.value.trim())
    
    // Search with coordinates
    await searchWeatherWithCoordinates(location.latitude, location.longitude, `${location.name}, ${location.country}`)
    
  } catch (err) {
    error.value = err.message || 'Failed to fetch weather data'
    console.error('Weather API Error:', err)
  } finally {
    isLoading.value = false
  }
}

const getCurrentLocation = async () => {
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
        
        searchQuery.value = locationName
        
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

// Function to close autocomplete when clicking outside
const closeAutocomplete = () => {
  showAutocomplete.value = false
  selectedSuggestionIndex.value = -1
}

// Function to search popular cities
const searchPopularCity = async (cityName) => {
  searchQuery.value = cityName
  showAutocomplete.value = false
  await searchWeather()
}

// Lifecycle
onMounted(async () => {
  // Load saved theme
  const savedTheme = localStorage.getItem('theme')
  isDarkMode.value = savedTheme === 'dark'
  
  // Add click outside listener for autocomplete
  document.addEventListener('click', (event) => {
    const searchContainer = document.querySelector('.search-container')
    if (searchContainer && !searchContainer.contains(event.target)) {
      closeAutocomplete()
    }
  })
  
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
    
    searchQuery.value = DEFAULT_CITY
    
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
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <GlobeAltIcon class="h-8 w-8 text-primary-blue mr-2" />
            <h1 class="text-2xl font-bold text-primary-blue">{{ APP_NAME }}</h1>
            <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">Weather Forecast</span>
          </div>
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
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Search Section -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1 relative search-container">
            <input
              v-model="searchQuery"
              @input="handleInputChange"
              @keydown="handleKeyDown"
              @blur="setTimeout(() => showAutocomplete = false, 200)"
              @focus="searchQuery.length >= 2 && debouncedAutocomplete(searchQuery, 5)"
              type="text"
              placeholder="Search for a city (e.g., Madrid, London, Tokyo)..."
              class="w-full px-4 py-3 pl-12 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            />
            
            <!-- Search icon -->
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
            </div>
            
            <!-- Loading indicator -->
            <div v-if="isSearching" class="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
            
            <!-- Autocomplete dropdown -->
            <div 
              v-if="showAutocomplete && autocompleteSuggestions.length > 0"
              class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              <div
                v-for="(suggestion, index) in autocompleteSuggestions"
                :key="`${suggestion.latitude}-${suggestion.longitude}`"
                @click="selectSuggestion(suggestion)"
                @mouseenter="selectedSuggestionIndex = index"
                :class="[
                  'px-4 py-3 cursor-pointer transition-colors duration-150',
                  index === selectedSuggestionIndex 
                    ? 'bg-blue-50 dark:bg-gray-600 text-blue-600 dark:text-blue-400' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
                ]"
              >
                <div class="flex items-center">
                  <MapPinIcon class="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div class="font-medium">{{ suggestion.name }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ suggestion.admin1 ? suggestion.admin1 + ', ' : '' }}{{ suggestion.country }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            @click="searchWeather"
            :disabled="isLoading"
            class="px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-dark-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isLoading ? 'Searching...' : 'Search' }}
          </button>
          <button
            @click="getCurrentLocation"
            class="px-6 py-3 bg-secondary-blue text-white rounded-lg hover:bg-accent-blue transition-colors flex items-center"
          >
            <MapPinIcon class="h-5 w-5 mr-2" />
            Current Location
          </button>
        </div>
        
        <!-- Error Message -->
        <div v-if="error" class="mt-4 p-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">
          {{ error }}
        </div>
      </div>

      <!-- Hero Section -->
      <div class="text-center mb-16">
        <h2 :class="['text-4xl font-bold mb-4 transition-colors duration-300', textClass]">
          Get Accurate Weather Forecasts
        </h2>
        <p :class="['text-xl mb-8 max-w-2xl mx-auto transition-colors duration-300', isDarkMode ? 'text-gray-300' : 'text-gray-600']">
          Stay informed with real-time weather data, extended forecasts, and detailed weather information for any location worldwide.
        </p>
        
        <!-- Popular Cities -->
        <div class="mt-8">
          <h3 :class="['text-lg font-semibold mb-4 transition-colors duration-300', isDarkMode ? 'text-gray-300' : 'text-gray-600']">
            Popular Cities
          </h3>
          <div class="flex flex-wrap justify-center gap-3">
            <button
              v-for="city in popularCities"
              :key="city"
              @click="searchPopularCity(city)"
              :class="['px-4 py-2 rounded-full text-sm transition-colors duration-300 flex items-center', 
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
            >
              <MapPinIcon class="h-4 w-4 mr-1" />
              {{ city }}
            </button>
          </div>
        </div>
      </div>

      <!-- Weather Display -->
      <div v-if="currentWeather" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Current Weather -->
        <div class="lg:col-span-2">
          <div :class="['rounded-xl p-8 shadow-lg', cardClass]">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-3xl font-bold">{{ currentWeather.location }}</h2>
                <p class="text-gray-500 dark:text-gray-400">{{ new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
              </div>
              <component :is="currentWeather.icon" class="h-16 w-16 text-yellow-500" />
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <div class="text-6xl font-bold">{{ currentWeather.temperature }}°C</div>
                <div class="text-xl text-gray-600 dark:text-gray-300">{{ currentWeather.condition }}</div>
              </div>
              <div class="text-right space-y-2">
                <div class="text-sm text-gray-500 dark:text-gray-400">Humidity: {{ currentWeather.humidity }}%</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">Wind: {{ currentWeather.windSpeed }} km/h</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">UV Index: {{ currentWeather.uvIndex }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Forecast -->
        <div>
          <h3 class="text-xl font-semibold mb-4">5-Day Forecast</h3>
          <div class="space-y-3">
            <div
              v-for="day in forecast"
              :key="day.day"
              :class="['flex items-center justify-between p-4 rounded-lg', cardClass]"
            >
              <div class="flex items-center space-x-3">
                <component :is="day.icon" class="h-8 w-8 text-gray-600 dark:text-gray-400" />
                <div>
                  <div class="font-medium">{{ day.day }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ day.condition }}</div>
                </div>
              </div>
              <div class="text-lg font-semibold">{{ day.temp }}°C</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="mt-16">
        <h3 :class="['text-2xl font-bold mb-6 text-center transition-colors duration-300', textClass]">
          Why Choose {{ APP_NAME }}?
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div :class="['rounded-lg shadow-md p-6 text-center transition-colors duration-300', cardClass]">
            <MapPinIcon class="h-12 w-12 text-primary-blue mx-auto mb-4" />
            <h4 :class="['text-xl font-semibold mb-2 transition-colors duration-300', textClass]">
              Precise Location
            </h4>
            <p :class="['transition-colors duration-300', isDarkMode ? 'text-gray-300' : 'text-gray-600']">
              Get accurate weather data for any location with GPS precision
            </p>
          </div>
          
          <div :class="['rounded-lg shadow-md p-6 text-center transition-colors duration-300', cardClass]">
            <ClockIcon class="h-12 w-12 text-primary-blue mx-auto mb-4" />
            <h4 :class="['text-xl font-semibold mb-2 transition-colors duration-300', textClass]">
              Extended Forecast
            </h4>
            <p :class="['transition-colors duration-300', isDarkMode ? 'text-gray-300' : 'text-gray-600']">
              Plan ahead with detailed 5-day weather forecasts
            </p>
          </div>
          
          <div :class="['rounded-lg shadow-md p-6 text-center transition-colors duration-300', cardClass]">
            <DevicePhoneMobileIcon class="h-12 w-12 text-primary-blue mx-auto mb-4" />
            <h4 :class="['text-xl font-semibold mb-2 transition-colors duration-300', textClass]">
              Mobile Friendly
            </h4>
            <p :class="['transition-colors duration-300', isDarkMode ? 'text-gray-300' : 'text-gray-600']">
              Beautiful interface with light and dark theme support
            </p>
          </div>
        </div>
      </div>

      <!-- Additional Information Section -->
      <div :class="['mt-16 rounded-lg p-8 transition-colors duration-300', isDarkMode ? 'bg-gray-800' : 'bg-gray-50']">
        <h3 :class="['text-2xl font-bold mb-6 text-center transition-colors duration-300', textClass]">
          How to Use {{ APP_NAME }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 :class="['text-lg font-semibold mb-3 transition-colors duration-300 flex items-center', textClass]">
              <MagnifyingGlassIcon class="h-5 w-5 mr-2" />
              Search Cities
            </h4>
            <ul :class="['space-y-2 transition-colors duration-300', isDarkMode ? 'text-gray-300' : 'text-gray-600']">
              <li>• Type any city name in the search box</li>
              <li>• Use autocomplete suggestions for accuracy</li>
              <li>• Get instant weather data for any location</li>
              <li>• Search works worldwide with precise coordinates</li>
            </ul>
          </div>
          <div>
            <h4 :class="['text-lg font-semibold mb-3 transition-colors duration-300 flex items-center', textClass]">
              <MapPinIcon class="h-5 w-5 mr-2" />
              Current Location
            </h4>
            <ul :class="['space-y-2 transition-colors duration-300', isDarkMode ? 'text-gray-300' : 'text-gray-600']">
              <li>• Click "Use Current Location" for instant results</li>
              <li>• GPS-based weather data for your exact position</li>
              <li>• Automatic city name detection</li>
              <li>• Works on all modern browsers and devices</li>
            </ul>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer :class="['py-8 transition-colors duration-300', isDarkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-gray-50 border-t border-gray-200']">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <p :class="['text-sm transition-colors duration-300', isDarkMode ? 'text-gray-400' : 'text-gray-600']">
            © {{ currentYear }} {{ APP_NAME }}. Built with Vue.js and Tailwind CSS.
          </p>
          <p :class="['text-xs mt-2 transition-colors duration-300', isDarkMode ? 'text-gray-500' : 'text-gray-500']">
            Weather data provided by <a href="https://open-meteo.com/" target="_blank" rel="noopener" class="text-blue-500 hover:text-blue-600">Open-Meteo</a> - Free Weather API
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Additional custom styles if needed */
</style>