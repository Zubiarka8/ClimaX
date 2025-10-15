<template>
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
</template>

<script setup>
import { computed } from 'vue'
import { MapPinIcon } from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  isDarkMode: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['search-city'])

// Popular cities for quick search
const popularCities = [
  'New York', 'London', 'Tokyo', 'Paris', 'Madrid', 'Barcelona', 
  'Rome', 'Berlin', 'Amsterdam', 'Sydney', 'Los Angeles', 'Chicago'
]

// Computed properties
const textClass = computed(() => 
  props.isDarkMode ? 'text-white' : 'text-gray-900'
)

// Methods
const searchPopularCity = (cityName) => {
  emit('search-city', cityName)
}
</script>

