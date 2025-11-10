/**
 * useWeather - Composable to handle weather state
 *
 * This composable provides a reactive interface to interact with WeatherService,
 * managing loading states, errors and weather data.
 */

import { ref, computed } from 'vue'
import weatherService from '../services/weatherService.js'

// Import Heroicons for weather condition mapping
import {
  SunIcon,
  MoonIcon,
  CloudIcon,
  BoltIcon,
  EyeIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

/**
 * Weather code mapping to Heroicons
 */
const WEATHER_ICONS = {
  0: SunIcon,        // Clear sky
  1: SunIcon,        // Mainly clear
  2: CloudIcon,      // Partly cloudy
  3: CloudIcon,      // Overcast
  45: EyeIcon,       // Fog
  48: EyeIcon,       // Depositing rime fog
  51: CloudIcon,     // Light drizzle
  53: CloudIcon,     // Moderate drizzle
  55: CloudIcon,     // Dense drizzle
  56: ExclamationTriangleIcon, // Freezing drizzle
  57: ExclamationTriangleIcon, // Dense freezing drizzle
  61: CloudIcon,     // Slight rain
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

export function useWeather() {
  // Reactive states
  const currentWeather = ref(null)
  const forecast = ref([])
  const isLoading = ref(false)
  const error = ref('')

  /**
   * Gets the icon corresponding to a weather code
   * @param {number} weatherCode - Weather code
   * @returns {Component} Heroicons icon component
   */
  const getWeatherIcon = (weatherCode) => {
    return WEATHER_ICONS[weatherCode] || SunIcon
  }

  /**
   * Processes weather data and adds corresponding icons
   * @param {Object} weatherData - Weather data from the service
   * @returns {Object} Weather data with icons
   */
  const processWeatherWithIcons = (weatherData) => {
    const processedData = { ...weatherData }
    // Add icon to current weather
    if (processedData.current) {
      processedData.current.icon = getWeatherIcon(processedData.current.weatherCode)
      if (processedData.location) processedData.current.location = processedData.location
    }
    // Add icons to forecast
    if (processedData.forecast) {
      processedData.forecast = processedData.forecast.map(day => ({
        ...day,
        icon: getWeatherIcon(day.weatherCode)
      }))
    }
    return processedData
  }

  /**
   * Searches weather for a specific city
   * @param {string} cityName - City name
   */
  const searchWeatherByCity = async (cityName) => {
    if (!cityName?.trim()) return
    isLoading.value = true
    error.value = ''
    try {
      const weatherData = await weatherService.getWeatherByCity(cityName.trim())
      const processedData = processWeatherWithIcons(weatherData)
      currentWeather.value = processedData.current
      forecast.value = processedData.forecast
    } catch (err) {
      error.value = err.message || 'Could not get weather for the city'
      console.error('Error searching weather by city:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Gets weather for the user's current location
   */
  const getCurrentLocationWeather = async () => {
    isLoading.value = true
    error.value = ''
    try {
      const weatherData = await weatherService.getWeatherByCurrentLocation()
      const processedData = processWeatherWithIcons(weatherData)
      currentWeather.value = processedData.current
      forecast.value = processedData.forecast
    } catch (err) {
      error.value = err.message || 'Could not get weather for your location'
      console.error('Error getting current location weather:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Removed method: searchWeatherByCoordinates
  // No longer needed because autocomplete doesn't trigger automatic searches

  /**
   * Loads default weather
   */
  const loadDefaultWeather = async () => {
    isLoading.value = true
    error.value = ''
    try {
      const weatherData = await weatherService.getDefaultWeather()
      const processedData = processWeatherWithIcons(weatherData)
      currentWeather.value = processedData.current
      forecast.value = processedData.forecast
    } catch (err) {
      error.value = err.message || 'Could not load default weather'
      console.error('Error loading default weather:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Gets autocomplete suggestions for cities
   * @param {string} query - Search query
   * @param {number} count - Maximum number of suggestions
   * @returns {Promise<Array>} Array of suggestions
   */
  const getCitySuggestions = async (query, count = 5) => {
    try {
      return await weatherService.getCitySuggestions(query, count)
    } catch (err) {
      console.error('Error getting suggestions:', err)
      return []
    }
  }

  /**
   * Clears the error state
   */
  const clearError = () => {
    error.value = ''
  }

  /**
   * Clears all weather data
   */
  const clearWeatherData = () => {
    currentWeather.value = null
    forecast.value = []
    error.value = ''
    isLoading.value = false
  }

  // Computed properties
  const hasWeatherData = computed(() => currentWeather.value !== null)
  const hasError = computed(() => error.value !== '')
  const isReady = computed(() => !isLoading.value && hasWeatherData.value)

  return {
    // States
    currentWeather,
    forecast,
    isLoading,
    error,
    // Computed properties
    hasWeatherData,
    hasError,
    isReady,
    // Methods
    searchWeatherByCity,
    getCurrentLocationWeather,
    loadDefaultWeather,
    getCitySuggestions,
    getWeatherIcon,
    clearError,
    clearWeatherData
  }
}
