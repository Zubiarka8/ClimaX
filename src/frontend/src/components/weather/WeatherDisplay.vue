<template>
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
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentWeather: {
    type: Object,
    default: null
  },
  forecast: {
    type: Array,
    default: () => []
  },
  isDarkMode: {
    type: Boolean,
    default: false
  }
})

const cardClass = computed(() => 
  props.isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200'
)
</script>

