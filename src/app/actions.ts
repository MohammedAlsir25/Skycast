'use server';

import type { WeatherData } from '@/lib/types';

// Helper function to get coordinates for a city
async function getCoordinates(city: string, apiKey: string): Promise<{ lat: number; lon: number; country: string; name: string } | null> {
  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  const response = await fetch(geoUrl);
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  if (data.length === 0) {
    return null;
  }
  return { lat: data[0].lat, lon: data[0].lon, country: data[0].country, name: data[0].name };
}

export async function getWeather(city: string): Promise<WeatherData> {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    throw new Error('Missing OpenWeatherMap API Key. Please add it to your .env file. You can get a free key from https://home.openweathermap.org/users/sign_up');
  }

  const coordinates = await getCoordinates(city, apiKey);

  if (!coordinates) {
    throw new Error(`City "${city}" not found.`);
  }

  const { lat, lon, country, name } = coordinates;
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${apiKey}&units=metric`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }
  
  const data: WeatherData = await response.json();
  
  // Add city name and country to the response as it's not included in the one-call API response
  data.name = name;
  data.country = country;

  return data;
}
