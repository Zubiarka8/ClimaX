<template>
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
</template>

<script setup>
import { ref } from 'vue'
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/vue/24/outline'

const GEOCODING_API_URL = import.meta.env.VITE_GEOCODING_API_URL || 'https://geocoding-api.open-meteo.com/v1/search'

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['search', 'current-location', 'suggestion-selected'])

const searchQuery = ref('')
const autocompleteSuggestions = ref([])
const showAutocomplete = ref(false)
const selectedSuggestionIndex = ref(-1)
const isSearching = ref(false)

let debounceTimer = null
const debounce = (func, delay) => {
  return (...args) => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => func.apply(null, args), delay)
  }
}

const getAutocompleteSuggestions = async (query, count = 5) => {
  if (!query || query.length < 2) {
    autocompleteSuggestions.value = []
    showAutocomplete.value = false
    return
  }
  try {
    isSearching.value = true
    const response = await fetch(`${GEOCODING_API_URL}?name=${encodeURIComponent(query)}&count=${count}&language=en&format=json`)
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

const debouncedAutocomplete = debounce(getAutocompleteSuggestions, 300)

const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion.displayName
  showAutocomplete.value = false
  selectedSuggestionIndex.value = -1
  emit('suggestion-selected', suggestion)
}

// Function to handle keyboard navigation in autocomplete
const handleKeyDown = (event) => {
  if (!showAutocomplete.value || autocompleteSuggestions.value.length === 0) {
    if (event.key === 'Enter') searchWeather()
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
      } else searchWeather()
      break
    case 'Escape':
      showAutocomplete.value = false
      selectedSuggestionIndex.value = -1
      break
  }
}

const handleInputChange = (event) => {
  const value = event.target.value
  searchQuery.value = value
  if (value.length >= 2) debouncedAutocomplete(value, 5)
  else showAutocomplete.value = false
  autocompleteSuggestions.value = []
}

const searchWeather = () => {
  if (!searchQuery.value.trim()) return
  showAutocomplete.value = false
  emit('search', searchQuery.value.trim())
}

const getCurrentLocation = () => {
  emit('current-location')
}

defineExpose({
  searchQuery,
  setSearchQuery: (value) => { searchQuery.value = value }
})
</script>

