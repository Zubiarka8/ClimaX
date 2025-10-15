// ClimaX Backend Environment Configuration (CommonJS)
// This file contains only the environment variables that are actually used

const dotenv = require('dotenv')

// Load environment variables from .env file
dotenv.config()

const envConfig = {
  // Server Configuration
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || 'localhost',

  // API Configuration
  OPEN_METEO_API_URL: process.env.OPEN_METEO_API_URL || 'https://api.open-meteo.com/v1',
  GEOCODING_API_URL: process.env.GEOCODING_API_URL || 'https://geocoding-api.open-meteo.com/v1/search',

  // Application Configuration
  APP_NAME: process.env.APP_NAME || 'ClimaX Backend',
  APP_VERSION: process.env.APP_VERSION || '1.0.0',

  // Development/Production flags
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production'
}

const {
  PORT,
  NODE_ENV,
  HOST,
  OPEN_METEO_API_URL,
  GEOCODING_API_URL,
  APP_NAME,
  APP_VERSION,
  IS_DEVELOPMENT,
  IS_PRODUCTION
} = envConfig

// Log configuration in development mode
if (IS_DEVELOPMENT) {
  console.log('🌤️ ClimaX Backend Environment Configuration:', {
    mode: NODE_ENV,
    port: PORT,
    host: HOST,
    appName: APP_NAME,
    version: APP_VERSION,
    apiUrl: OPEN_METEO_API_URL
  })
}

// Validate required environment variables (only in production)
if (IS_PRODUCTION) {
  const requiredEnvVars = [
    'OPEN_METEO_API_URL',
    'GEOCODING_API_URL'
  ]

  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])

  if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars)
    process.exit(1)
  }
}

module.exports = {
  envConfig,
  PORT,
  NODE_ENV,
  HOST,
  OPEN_METEO_API_URL,
  GEOCODING_API_URL,
  APP_NAME,
  APP_VERSION,
  IS_DEVELOPMENT,
  IS_PRODUCTION
}
