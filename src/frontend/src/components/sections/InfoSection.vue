<template>
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
</template>

<script setup>
import { computed } from 'vue'
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/vue/24/outline'

// Environment variables
const APP_NAME = import.meta.env.VITE_APP_NAME || 'ClimaX'

// Props
const props = defineProps({
  isDarkMode: {
    type: Boolean,
    default: false
  }
})

// Computed properties
const textClass = computed(() => 
  props.isDarkMode ? 'text-white' : 'text-gray-900'
)
</script>

