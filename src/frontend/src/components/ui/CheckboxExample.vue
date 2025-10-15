<template>
  <div class="p-8 space-y-8">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Checkbox Component Examples</h2>
      <p class="text-gray-600 dark:text-gray-400">Beautiful and customizable checkbox component with dark mode support.</p>
    </div>

    <!-- Basic Examples -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Basic Examples</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <Checkbox
            id="basic-1"
            v-model="basic1"
            label="Basic checkbox"
            variant="primary"
          />
          <Checkbox
            id="basic-2"
            v-model="basic2"
            label="Checked by default"
            variant="primary"
          />
          <Checkbox
            id="basic-3"
            v-model="basic3"
            label="Disabled checkbox"
            variant="primary"
            disabled
          />
          <Checkbox
            id="basic-4"
            v-model="basic4"
            label="Required checkbox"
            variant="primary"
            required
          />
        </div>
        <div class="space-y-4">
          <Checkbox
            id="basic-5"
            v-model="basic5"
            label="Without label"
            variant="primary"
          />
          <Checkbox
            id="basic-6"
            v-model="basic6"
            label="Large size"
            variant="primary"
            size="lg"
          />
          <Checkbox
            id="basic-7"
            v-model="basic7"
            label="Small size"
            variant="primary"
            size="sm"
          />
        </div>
      </div>
    </div>

    <!-- Variants -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Color Variants</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Checkbox
          id="variant-1"
          v-model="variant1"
          label="Primary (Blue)"
          variant="primary"
        />
        <Checkbox
          id="variant-2"
          v-model="variant2"
          label="Secondary (Gray)"
          variant="secondary"
        />
        <Checkbox
          id="variant-3"
          v-model="variant3"
          label="Success (Green)"
          variant="success"
        />
        <Checkbox
          id="variant-4"
          v-model="variant4"
          label="Warning (Yellow)"
          variant="warning"
        />
        <Checkbox
          id="variant-5"
          v-model="variant5"
          label="Error (Red)"
          variant="error"
        />
      </div>
    </div>

    <!-- Form Examples -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Form Examples</h3>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">Newsletter Preferences</h4>
        <div class="space-y-3">
          <Checkbox
            id="newsletter-1"
            v-model="newsletter1"
            label="Daily weather updates"
            variant="primary"
          />
          <Checkbox
            id="newsletter-2"
            v-model="newsletter2"
            label="Weekly summary"
            variant="primary"
          />
          <Checkbox
            id="newsletter-3"
            v-model="newsletter3"
            label="Severe weather alerts"
            variant="warning"
          />
          <Checkbox
            id="newsletter-4"
            v-model="newsletter4"
            label="Product updates and features"
            variant="secondary"
          />
        </div>
      </div>
    </div>

    <!-- Interactive Demo -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Interactive Demo</h3>
      <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Settings</h4>
            <div class="space-y-3">
              <Checkbox
                id="setting-1"
                v-model="setting1"
                label="Enable notifications"
                variant="primary"
              />
              <Checkbox
                id="setting-2"
                v-model="setting2"
                label="Auto-save preferences"
                variant="success"
              />
              <Checkbox
                id="setting-3"
                v-model="setting3"
                label="Share usage data"
                variant="secondary"
              />
            </div>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Current Values</h4>
            <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div>Notifications: {{ setting1 ? 'Enabled' : 'Disabled' }}</div>
              <div>Auto-save: {{ setting2 ? 'Enabled' : 'Disabled' }}</div>
              <div>Data sharing: {{ setting3 ? 'Enabled' : 'Disabled' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Checkbox from './Checkbox.vue'

// Basic examples
const basic1 = ref(false)
const basic2 = ref(true)
const basic3 = ref(false)
const basic4 = ref(false)
const basic5 = ref(false)
const basic6 = ref(false)
const basic7 = ref(false)

// Variants
const variant1 = ref(true)
const variant2 = ref(true)
const variant3 = ref(true)
const variant4 = ref(true)
const variant5 = ref(true)

// Newsletter
const newsletter1 = ref(true)
const newsletter2 = ref(false)
const newsletter3 = ref(true)
const newsletter4 = ref(false)

// Settings
const setting1 = ref(true)
const setting2 = ref(false)
const setting3 = ref(true)
</script>
