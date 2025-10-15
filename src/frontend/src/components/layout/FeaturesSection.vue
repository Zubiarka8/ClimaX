<template>
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
</template>

<script setup>
import { computed } from 'vue'
import { MapPinIcon, ClockIcon, DevicePhoneMobileIcon } from '@heroicons/vue/24/outline'

const APP_NAME = import.meta.env.VITE_APP_NAME || 'ClimaX'

const props = defineProps({
  isDarkMode: {
    type: Boolean,
    default: false
  }
})

const textClass = computed(() => 
  props.isDarkMode ? 'text-white' : 'text-gray-900'
)

const cardClass = computed(() => 
  props.isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200'
)
</script>

