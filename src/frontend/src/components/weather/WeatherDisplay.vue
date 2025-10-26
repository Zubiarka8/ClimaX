<template>
  <div v-if="currentWeather" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Current Weather -->
    <div class="lg:col-span-2">
      <div class="relative backdrop-blur-xl bg-white/30 dark:bg-gray-900/10 border border-white/40 dark:border-gray-700/30 rounded-3xl p-8 shadow-2xl shadow-gray-200/30 dark:shadow-gray-900/30">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 :class="['text-3xl font-bold', isDarkMode ? 'text-white' : 'text-gray-800']">{{ currentWeather.location }}</h2>
            <p :class="['', isDarkMode ? 'text-gray-300' : 'text-gray-600']">{{ new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
          </div>
          <component :is="currentWeather.icon" class="h-16 w-16 text-yellow-400 drop-shadow-lg" />
        </div>
        <div class="flex items-center justify-between">
          <div>
            <div :class="['text-6xl font-bold drop-shadow-lg', isDarkMode ? 'text-white' : 'text-gray-800']">{{ currentWeather.temperature }}°C</div>
            <div :class="['text-xl', isDarkMode ? 'text-gray-200' : 'text-gray-600']">{{ currentWeather.condition }}</div>
          </div>
          <div class="text-right space-y-2 backdrop-blur-md bg-white/20 dark:bg-gray-800/5 border border-white/30 dark:border-gray-600/20 rounded-2xl p-4">
            <div :class="['text-sm', isDarkMode ? 'text-gray-200' : 'text-gray-600']">Humidity: {{ currentWeather.humidity }}%</div>
            <div :class="['text-sm', isDarkMode ? 'text-gray-200' : 'text-gray-600']">Wind: {{ currentWeather.windSpeed }} km/h</div>
            <div :class="['text-sm', isDarkMode ? 'text-gray-200' : 'text-gray-600']">UV Index: {{ currentWeather.uvIndex }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- Forecast -->
    <div>
      <h3 :class="['text-xl font-semibold mb-4', isDarkMode ? 'text-white' : 'text-gray-800']">5-Day Forecast</h3>
      <div class="space-y-3">
        <div
          v-for="day in forecast"
          :key="day.day"
          class="relative backdrop-blur-md bg-white/30 dark:bg-gray-800/10 border border-white/40 dark:border-gray-600/30 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <component :is="day.icon" :class="['h-8 w-8', isDarkMode ? 'text-gray-300' : 'text-gray-500']" />
              <div>
                <div :class="['font-medium', isDarkMode ? 'text-white' : 'text-gray-800']">{{ day.day }}</div>
                <div :class="['text-sm', isDarkMode ? 'text-gray-300' : 'text-gray-600']">{{ day.condition }}</div>
              </div>
            </div>
            <div :class="['text-lg font-semibold', isDarkMode ? 'text-white' : 'text-gray-800']">{{ day.temp }}°C</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTheme } from '../../composables/useTheme.js'

const props = defineProps({
  currentWeather: {
    type: Object,
    default: null
  },
  forecast: {
    type: Array,
    default: () => []
  }
})

const { cardClass, isDarkMode } = useTheme()
</script>

