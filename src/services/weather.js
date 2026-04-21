import axios from 'axios';

const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'your_api_key_here';
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Get weather data for a location
export const getWeatherData = async (lat, lon) => {
  try {
    const response = await axios.get(`${WEATHER_BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: WEATHER_API_KEY,
        units: 'metric'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

// Get 5-day weather forecast
export const getWeatherForecast = async (lat, lon) => {
  try {
    const response = await axios.get(`${WEATHER_BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: WEATHER_API_KEY,
        units: 'metric'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    return null;
  }
};

// Get coordinates for a city (Rwanda locations)
export const getCoordinates = async (city) => {
  try {
    const response = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
      params: {
        q: `${city},RW`,
        limit: 1,
        appid: WEATHER_API_KEY
      }
    });
    if (response.data && response.data.length > 0) {
      return {
        lat: response.data[0].lat,
        lon: response.data[0].lon
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
};

// Get weather impact on crop prices (simplified logic)
export const getWeatherImpact = (weatherData) => {
  if (!weatherData) return 'Weather data unavailable - please check API key';

  const { main, weather } = weatherData;
  const temp = main.temp;
  const condition = weather[0].main.toLowerCase();

  // Simplified weather impact logic
  if (temp < 15) {
    return 'Cold weather may increase prices due to reduced yields';
  } else if (temp > 30) {
    return 'Hot weather may affect crop quality and increase prices';
  } else if (condition.includes('rain')) {
    return 'Rain may improve yields and stabilize prices';
  } else if (condition.includes('clear')) {
    return 'Good weather conditions generally stabilize prices';
  } else if (condition.includes('cloud')) {
    return 'Cloudy conditions may have neutral impact on prices';
  }

  return 'Weather conditions may influence market prices';
};