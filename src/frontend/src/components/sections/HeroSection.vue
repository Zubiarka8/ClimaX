<template>
  <div class="text-center mb-16">
    <!-- Main content with glassmorphism background -->
    <div class="relative backdrop-blur-xl bg-white/30 dark:bg-gray-900/10 border border-white/40 dark:border-gray-700/30 rounded-3xl p-8 shadow-2xl shadow-gray-200/30 dark:shadow-gray-900/30">
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
          <Button
            v-for="city in popularCities"
            :key="city"
            @click="searchPopularCity(city)"
            variant="glass"
            size="sm"
            rounded="full"
            custom-class="px-4 py-2"
            :icon="MapPinIcon"
          >
            {{ city }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { MapPinIcon } from '@heroicons/vue/24/outline'
import { useTheme } from '../../composables/useTheme.js'
import Button from '../ui/Button.vue'

const { isDarkMode, textClass } = useTheme()

// Emits
const emit = defineEmits(['search-city'])

// Popular cities for quick search
const popularCities = [
  'New York', 'London', 'Tokyo', 'Paris', 'Madrid', 'Barcelona',
  'Rome', 'Berlin', 'Amsterdam', 'Sydney', 'Los Angeles', 'Chicago'
]

// Methods
const searchPopularCity = (cityName) => {
  emit('search-city', cityName)
}
</script>

