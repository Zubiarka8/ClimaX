<script setup>
  import { onMounted } from 'vue';
  import { useAuthStore } from './stores/authStore.js';
  import { useTheme } from './composables/useTheme.js';
  const { initializeAuth } = useAuthStore();
  const { initializeTheme } = useTheme();
  onMounted(() => {
    initializeAuth();
    initializeTheme();
  });
</script>
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
  html, body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  #app {
    min-height: 100vh;
  }
</style>