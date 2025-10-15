<script setup>
  import { onMounted } from 'vue';
  import { useAuthStore } from './stores/authStore.js';
  const { initializeAuth } = useAuthStore();
  onMounted(() => {
    initializeAuth();
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