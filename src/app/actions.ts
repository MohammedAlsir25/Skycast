'use server';

import type { WeatherData, ApiWeatherData, DailyWeatherData } from '@/lib/types';

// This is the shape of the data from the One Call API, which is different
// from the other API endpoints.
interface OneCallApiData {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: Omit<CurrentWeatherData, 'visibility'> & { visibility?: number }; // Visibility is sometimes not provided
  daily: DailyWeatherData[];
}


export async function getWeather(city: string): Promise<WeatherData> {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    throw new Error('Missing OpenWeatherMap API Key. Please add it to your .env file. You can get a free key from https://home.openweathermap.org/users/sign_up');
  }
  
  // Step 1: Get coordinates for the city
  const geoUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const geoResponse = await fetch(geoUrl);
  if (!geoResponse.ok) {
    if(geoResponse.status === 404) {
      throw new Error(`City "${city}" not found.`);
    } else {
      throw new Error('Failed to fetch location data.');
    }
  }
  const geoData: ApiWeatherData = await geoResponse.json();
  const { lat, lon } = geoData.coord;

  // Step 2: Use coordinates to get full weather data from One Call API
  const oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=metric`;
  const oneCallResponse = await fetch(oneCallUrl);
   if (!oneCallResponse.ok) {
    throw new Error('Failed to fetch weather data from OneCall API.');
  }
  const weatherData: OneCallApiData = await oneCallResponse.json();

  return {
    current: {
      ...weatherData.current,
      visibility: weatherData.current.visibility || 0, // Ensure visibility is a number
    },
    daily: weatherData.daily.slice(0, 7), // Return forecast for the next 7 days
    name: geoData.name,
    sys: {
      country: geoData.sys.country
    }
  };
}
