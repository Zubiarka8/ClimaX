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
          class="w-full px-4 py-3 pl-12 pr-12 rounded-2xl backdrop-blur-xl bg-white/30 dark:bg-gray-800/20 border border-white/40 dark:border-gray-600/30 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 shadow-xl transition-all duration-300"
        />
        <!-- Search icon -->
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon class="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </div>
        <!-- Loading indicator -->
        <div v-if="isSearching" class="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
        </div>
        <!-- Autocomplete dropdown -->
        <div
          v-if="showAutocomplete && autocompleteSuggestions.length > 0"
          class="absolute z-50 w-full mt-1 backdrop-blur-xl bg-white/30 dark:bg-gray-800/20 border border-white/40 dark:border-gray-600/30 rounded-2xl shadow-2xl max-h-60 overflow-y-auto"
        >
          <div
            v-for="(suggestion, index) in autocompleteSuggestions"
            :key="`${suggestion.latitude}-${suggestion.longitude}`"
            @click="selectSuggestion(suggestion)"
            @mouseenter="selectedSuggestionIndex = index"
            :class="[
              'px-4 py-3 cursor-pointer transition-all duration-150 backdrop-blur-md',
              index === selectedSuggestionIndex 
                ? 'bg-blue-500/20 dark:bg-blue-400/20 text-blue-800 dark:text-blue-200' 
                : 'hover:bg-white/20 dark:hover:bg-gray-700/20 text-gray-800 dark:text-gray-100'
            ]"
          >
            <div class="flex items-center">
              <MapPinIcon class="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
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
      <Button
        @click="searchWeather"
        :disabled="isLoading"
        :loading="isLoading"
        variant="primary"
        size="lg"
        rounded="xl"
        custom-class="px-6 py-3"
      >
        {{ isLoading ? 'Searching...' : 'Search' }}
      </Button>
      <Button
        @click="getCurrentLocation"
        variant="success"
        size="lg"
        rounded="xl"
        custom-class="px-6 py-3"
        :icon="MapPinIcon"
      >
        Current Location
      </Button>
    </div>
    <!-- Error Message -->
    <div v-if="error" class="mt-4 p-4 backdrop-blur-xl bg-red-500/20 dark:bg-red-900/20 border border-red-400/30 dark:border-red-700/30 rounded-2xl text-red-800 dark:text-red-300 shadow-xl">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/vue/24/outline'
import Button from '../ui/Button.vue'

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

