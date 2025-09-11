'use server';

import type { WeatherData } from '@/lib/types';

export async function getWeather(city: string): Promise<WeatherData> {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    throw new Error('Missing OpenWeatherMap API Key. Please add it to your .env file. You can get a free key from https://home.openweathermap.org/users/sign_up');
  }
  
  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  const geoResponse = await fetch(geoUrl);
  if (!geoResponse.ok) {
    throw new Error('Failed to fetch city coordinates.');
  }
  const geoData = await geoResponse.json();
  if (geoData.length === 0) {
    throw new Error(`City "${city}" not found.`);
  }
  const { lat, lon, name } = geoData[0];

  const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${apiKey}&units=metric`;
  
  const weatherResponse = await fetch(weatherUrl);
  if (!weatherResponse.ok) {
    throw new Error('Failed to fetch weather data');
  }
  
  const weatherData: WeatherData = await weatherResponse.json();
  
  // Add city name and country to the response as onecall API doesn't provide it
  weatherData.name = name;
  weatherData.sys = {
    country: geoData[0].country
  };

  return weatherData;
}
