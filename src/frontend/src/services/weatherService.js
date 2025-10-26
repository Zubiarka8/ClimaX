/**
 * WeatherService - Dedicated service to handle all weather-related requests
 * 
 * This service encapsulates all the logic for communicating with weather and geocoding APIs,
 * providing a clean and consistent interface for obtaining weather data.
 */

// API configuration from environment variables
const OPEN_METEO_API_URL = import.meta.env.VITE_OPEN_METEO_API_URL || 'https://api.open-meteo.com/v1'
const GEOCODING_API_URL = import.meta.env.VITE_GEOCODING_API_URL || 'https://geocoding-api.open-meteo.com/v1/search'
const DEFAULT_CITY = import.meta.env.VITE_DEFAULT_CITY || 'New York'

/**
 * Weather code mapping to readable conditions
 */
const WEATHER_CONDITIONS = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail'
}

/**
 * Main weather service class
 */
class WeatherService {
  constructor() {
    this.apiBaseUrl = OPEN_METEO_API_URL
    this.geocodingUrl = GEOCODING_API_URL
    this.defaultCity = DEFAULT_CITY
  }

  /**
   * Obtiene coordenadas de una ciudad usando la API de geocodificación
   * Intenta diferentes estrategias de búsqueda para mejorar los resultados
   * @param {string} cityName - Nombre de la ciudad
   * @returns {Promise<Object>} Objeto con latitud, longitud, nombre y país
   * @throws {Error} If city is not found or there's an error in the request
   */
  async getCoordinatesFromCity(cityName) {
    try {
      // Strategy 1: Search as the name comes
      let response = await fetch(
        `${this.geocodingUrl}?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
      )
      
      if (!response.ok) {
        throw new Error(`Connection error: ${response.status}`)
      }
      
      let data = await response.json()
      
      // If we found results, return the first one
      if (data.results && data.results.length > 0) {
        const result = data.results[0]
        return {
          latitude: result.latitude,
          longitude: result.longitude,
          name: result.name,
          country: result.country,
          admin1: result.admin1
        }
      }
      
      // Strategy 2: If no results, try only with the first word
      const firstWord = cityName.split(',')[0].trim()
      if (firstWord !== cityName) {
        response = await fetch(
          `${this.geocodingUrl}?name=${encodeURIComponent(firstWord)}&count=1&language=en&format=json`
        )
        
        if (response.ok) {
          data = await response.json()
          if (data.results && data.results.length > 0) {
            const result = data.results[0]
            return {
              latitude: result.latitude,
              longitude: result.longitude,
              name: result.name,
              country: result.country,
              admin1: result.admin1
            }
          }
        }
      }
      
      // If we get here, the city was not found
      throw new Error('City not found')
      
    } catch (error) {
      console.error('Error getting coordinates:', error)
      // Only propagate the error if it's really a problem
      if (error.message.includes('City not found')) {
        throw error // Keep the specific message
      }
      throw new Error('Connection error. Check your internet and try again.')
    }
  }

  /**
   * Obtiene sugerencias de autocompletado para una ciudad
   * @param {string} query - Consulta de búsqueda
   * @param {number} count - Número máximo de sugerencias
   * @returns {Promise<Array>} Array de sugerencias de ciudades
   */
  async getCitySuggestions(query, count = 5) {
    if (!query || query.length < 2) {
      return []
    }

    try {
      const response = await fetch(
        `${this.geocodingUrl}?name=${encodeURIComponent(query)}&count=${count}&language=en&format=json`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data.results || data.results.length === 0) {
        return []
      }
      
      return data.results.map(result => ({
        name: result.name,
        country: result.country,
        admin1: result.admin1,
        latitude: result.latitude,
        longitude: result.longitude,
        displayName: `${result.name}${result.admin1 ? ', ' + result.admin1 : ''}, ${result.country}`
      }))
    } catch (error) {
      console.error('Error getting suggestions:', error)
      return []
    }
  }

  /**
   * Obtiene datos meteorológicos desde coordenadas
   * @param {number} latitude - Latitud
   * @param {number} longitude - Longitud
   * @returns {Promise<Object>} Datos meteorológicos procesados
   * @throws {Error} Si hay error en la petición
   */
  async getWeatherData(latitude, longitude) {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return this.processWeatherData(data)
    } catch (error) {
      console.error('Error getting weather data:', error)
      throw new Error('Could not get weather data')
    }
  }

  /**
   * Obtiene el nombre de la ubicación desde coordenadas (geocodificación inversa)
   * @param {number} latitude - Latitud
   * @param {number} longitude - Longitud
   * @returns {Promise<string>} Nombre de la ubicación
   */
  async getLocationName(latitude, longitude) {
    try {
      const response = await fetch(
        `${this.geocodingUrl}?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`
      )
      
      if (!response.ok) {
        throw new Error(`Connection error: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0]
        return `${result.name}${result.admin1 ? ', ' + result.admin1 : ''}, ${result.country}`
      }
      
      // If no name is found, use formatted coordinates
      return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
    } catch (error) {
      console.error('Error getting location name:', error)
      // In case of error, return formatted coordinates
      return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
    }
  }

  /**
   * Procesa los datos meteorológicos de la API y los formatea para la UI
   * @param {Object} rawData - Datos sin procesar de la API
   * @returns {Object} Datos meteorológicos procesados
   */
  processWeatherData(rawData) {
    const { current, daily } = rawData
    
    // Process current weather
    const currentWeather = {
      temperature: Math.round(current.temperature_2m),
      condition: this.getWeatherCondition(current.weather_code),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      uvIndex: 6, // Open-Meteo doesn't provide UV in the free tier
      weatherCode: current.weather_code
    }
    
    // Process 5-day forecast
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const forecast = daily.time.slice(0, 5).map((date, index) => {
      const day = new Date(date)
      const dayName = index === 0 ? 'Today' : dayNames[day.getDay()]
      
      return {
        day: dayName,
        temp: Math.round(daily.temperature_2m_max[index]),
        condition: this.getWeatherCondition(daily.weather_code[index]),
        weatherCode: daily.weather_code[index]
      }
    })
    
    return {
      current: currentWeather,
      forecast: forecast
    }
  }

  /**
   * Obtiene la condición meteorológica legible desde el código de clima
   * @param {number} weatherCode - Código de clima de la API
   * @returns {string} Condición meteorológica legible
   */
  getWeatherCondition(weatherCode) {
    return WEATHER_CONDITIONS[weatherCode] || 'Clear sky'
  }

  /**
   * Obtiene datos meteorológicos para una ciudad específica
   * @param {string} cityName - Nombre de la ciudad
   * @returns {Promise<Object>} Datos meteorológicos con información de ubicación
   */
  async getWeatherByCity(cityName) {
    try {
      const coordinates = await this.getCoordinatesFromCity(cityName)
      const weatherData = await this.getWeatherData(coordinates.latitude, coordinates.longitude)
      
      return {
        ...weatherData,
        location: `${coordinates.name}${coordinates.admin1 ? ', ' + coordinates.admin1 : ''}, ${coordinates.country}`
      }
    } catch (error) {
      console.error('Error getting weather by city:', error)
      throw error
    }
  }

  /**
   * Obtiene datos meteorológicos para la ubicación actual del usuario
   * @returns {Promise<Object>} Datos meteorológicos con información de ubicación
   */
  async getWeatherByCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('La geolocalización no está soportada por este navegador'))
        return
      }
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            
            // Get weather data and location name in parallel
            const [weatherData, locationName] = await Promise.all([
              this.getWeatherData(latitude, longitude),
              this.getLocationName(latitude, longitude)
            ])
            
            resolve({
              ...weatherData,
              location: locationName
            })
          } catch (error) {
            console.error('Error getting current location weather:', error)
            reject(new Error('Could not get weather for your current location'))
          }
        },
        (error) => {
          let errorMessage = 'Unknown error getting location'
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable'
              break
            case error.TIMEOUT:
              errorMessage = 'Location request timed out'
              break
          }
          
          reject(new Error(errorMessage))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutos
        }
      )
    })
  }

  /**
   * Gets weather data for the default city
   * @returns {Promise<Object>} Weather data with location information
   */
  async getDefaultWeather() {
    try {
      return await this.getWeatherByCity(this.defaultCity)
    } catch (error) {
      console.error('Error getting default weather:', error)
      throw new Error('Could not load default weather')
    }
  }
}

// Create and export a singleton instance of the service
const weatherService = new WeatherService()

export default weatherService
export { WeatherService }
