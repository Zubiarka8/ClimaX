import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)
app.use(router)

app.mount('#app')

// Global theme management
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme')
  document.documentElement.classList.toggle('dark', savedTheme === 'dark')
})
