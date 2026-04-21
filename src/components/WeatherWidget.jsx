import { useState, useEffect } from 'react';
import { getWeatherData, getWeatherImpact } from '../services/weather';
import { Cloud, Sun, CloudRain, Thermometer, Droplets, Wind } from 'lucide-react';

export default function WeatherWidget({ marketLocation }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (marketLocation) {
      fetchWeather();
    }
  }, [marketLocation]);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const city = marketLocation?.city || marketLocation?.name || 'Kigali';
      const coords = await getCoordinates(city);
      if (coords) {
        const data = await getWeatherData(coords.lat, coords.lon);
        setWeather(data);
      } else {
        setError('Location not found');
        // Fallback demo data
        const mockWeatherData = {
          main: { temp: 24, humidity: 65 },
          weather: [{ main: 'Clear', description: 'clear sky' }],
          wind: { speed: 3.5 }
        };
        setTimeout(() => setWeather(mockWeatherData), 1000);
      }
    } catch (err) {
      setError('Weather API error');
      console.error('Weather fetch error:', err);
      // Fallback demo
      const mockWeatherData = {
        main: { temp: 24, humidity: 65 },
        weather: [{ main: 'Clear', description: 'clear sky' }],
        wind: { speed: 3.5 }
      };
      
      setTimeout(() => setWeather(mockWeatherData), 1000);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    const main = condition?.toLowerCase();
    if (main?.includes('rain')) return <CloudRain className="w-8 h-8 text-blue-500" />;
    if (main?.includes('cloud')) return <Cloud className="w-8 h-8 text-gray-500" />;
    if (main?.includes('clear')) return <Sun className="w-8 h-8 text-yellow-500" />;
    return <Cloud className="w-8 h-8 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <Cloud className="w-6 h-6 text-gray-400" />
          <h3 className="font-semibold text-gray-700">Weather Info</h3>
        </div>
        <p className="text-gray-500 text-sm">
          {error || 'Weather data unavailable'}
        </p>
      </div>
    );
  }

  const impact = getWeatherImpact(weather);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getWeatherIcon(weather.weather[0].main)}
          <div>
            <h3 className="font-semibold text-gray-800">Weather Impact</h3>
{city ? `${city}, Rwanda` : 'Kigali, Rwanda'}
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1">
            <Thermometer className="w-4 h-4 text-red-500" />
            <span className="font-bold text-lg">{Math.round(weather.main.temp)}°C</span>
          </div>
          <p className="text-xs text-gray-500 capitalize">
            {weather.weather[0].description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Droplets className="w-4 h-4 text-blue-500" />
          <div>
            <p className="text-xs text-gray-500">Humidity</p>
            <p className="font-semibold">{weather.main.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Wind className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Wind</p>
            <p className="font-semibold">{Math.round(weather.wind.speed * 3.6)} km/h</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Market Impact:</strong> {impact}
        </p>
      </div>
    </div>
  );
}