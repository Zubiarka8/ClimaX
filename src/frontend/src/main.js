import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

// Create Vue app instance
const app = createApp(App)

// Mount the app to the DOM
app.mount('#app')

// Global theme management
// This ensures the theme is applied immediately on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})
