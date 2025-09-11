'use server';

import type { WeatherData } from '@/lib/types';

// Function to generate pseudo-random weather data based on city name
function generateMockWeatherData(city: string): WeatherData {
  // Simple hash function to create some variability based on the city name
  let hash = 0;
  for (let i = 0; i < city.length; i++) {
    const char = city.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  const temp = (hash % 35) + 5; // Temp between 5 and 39
  const humidity = (hash % 50) + 40; // Humidity between 40 and 89
  const windSpeed = ((hash % 80) / 10) + 2; // Wind speed between 2.0 and 9.9
  const weatherOptions = [
    { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
    { id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' },
    { id: 803, main: 'Clouds', description: 'scattered clouds', icon: '04d' },
    { id: 500, main: 'Rain', description: 'light rain', icon: '10d' },
    { id: 521, main: 'Rain', description: 'shower rain', icon: '09d' },
    { id: 600, main: 'Snow', description: 'light snow', icon: '13d' },
    { id: 741, main: 'Fog', description: 'fog', icon: '50d' },
    { id: 211, main: 'Thunderstorm', description: 'thunderstorm', icon: '11d' },
  ];
  const weather = weatherOptions[Math.abs(hash) % weatherOptions.length];

  return {
    coord: { lon: (hash % 18000) / 100, lat: (hash % 9000) / 100 },
    weather: [weather],
    base: 'stations',
    main: {
      temp: temp,
      feels_like: temp - 2,
      temp_min: temp - 4,
      temp_max: temp + 4,
      pressure: 1012,
      humidity: humidity,
    },
    visibility: 10000,
    wind: { speed: parseFloat(windSpeed.toFixed(2)), deg: Math.abs(hash % 360) },
    clouds: { all: Math.abs(hash % 100) },
    dt: Date.now() / 1000,
    sys: {
      type: 2,
      id: Math.abs(hash % 1000000),
      country: 'XX',
      sunrise: (Date.now() / 1000) - 21600, // Approx 6 hours ago
      sunset: (Date.now() / 1000) + 21600, // Approx 6 hours from now
    },
    timezone: 3600,
    id: Math.abs(hash % 10000000),
    name: city.charAt(0).toUpperCase() + city.slice(1),
    cod: 200,
  };
}


export async function getWeather(city: string): Promise<WeatherData> {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  if (!apiKey) {
    throw new Error('Missing OpenWeatherMap API Key. Please add it to your .env file to fetch real weather data. You can get a free key from https://openweathermap.org/price.');
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  if (!response.ok) {
      if (response.status === 404) {
          throw new Error('City not found');
      }
      throw new Error('Failed to fetch weather data');
  }
  const data = await response.json();
  return data;
}
