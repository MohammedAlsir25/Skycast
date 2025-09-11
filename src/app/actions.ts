'use server';

import type { WeatherData, DailyForecast, HourlyForecast, WeatherPeriod, OpenWeatherOneCallResponse } from '@/lib/types';

// Helper to check for the API key and throw a clear error if it's missing.
function getApiKey(): string {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    throw new Error('OpenWeatherMap API key is missing. Please add it to your .env file.');
  }
  return apiKey;
}

// Helper to get city and state from displayName
function getLocationFromName(displayName: string): { name: string; country: string } {
    const parts = displayName.split(', ');
    if (parts.length >= 2) {
        return { name: parts[0], country: parts[parts.length - 1] };
    }
    return { name: displayName, country: '' };
}

// Converts Unix timestamp to a formatted time string
const formatTime = (timestamp: number, timeZone: string): string => {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
    timeZone,
  });
};

// Converts Unix timestamp to a short day string (e.g., "Mon")
const formatDay = (timestamp: number, timeZone: string): string => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    weekday: 'short',
    timeZone,
  });
};


export async function getWeather(city: string): Promise<WeatherData> {
  const apiKey = getApiKey();

  // Step 1: Geocode city name to get lat/lon.
  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`;
  const geoResponse = await fetch(geoUrl);

  if (!geoResponse.ok) {
    throw new Error('Failed to fetch location data from OpenWeatherMap.');
  }

  const geoData = await geoResponse.json();
  if (geoData.length === 0) {
    throw new Error(`City "${city}" not found.`);
  }

  const { lat, lon, name, country } = geoData[0];
  
  // Step 2: Get weather data using the One Call API.
  const oneCallUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${apiKey}&units=imperial`;
  const weatherResponse = await fetch(oneCallUrl);

  if (!weatherResponse.ok) {
    throw new Error('Failed to fetch weather data from OneCall API.');
  }

  const data: OpenWeatherOneCallResponse = await weatherResponse.json();

  // Step 3: Process and combine the data into our app's format.
  const currentConditions: WeatherPeriod = {
    startTime: new Date(data.current.dt * 1000).toISOString(),
    name: "Current",
    temperature: data.current.temp,
    temperatureUnit: 'F',
    windSpeed: `${Math.round(data.current.wind_speed)} mph`,
    windDirection: '', // Not always available in current
    icon: `https://openweathermap.org/img/wn/${data.current.weather[0].icon}@4x.png`,
    shortForecast: data.current.weather[0].main,
    detailedForecast: data.current.weather[0].description,
    humidity: data.current.humidity,
    pressure: data.current.pressure,
    visibility: data.current.visibility / 1000, // convert to km
    sunrise: formatTime(data.current.sunrise, data.timezone),
    sunset: formatTime(data.current.sunset, data.timezone),
    feels_like: data.current.feels_like,
    isDaytime: true,
  };

  const dailyForecasts: DailyForecast[] = data.daily.slice(0, 7).map(day => ({
      date: new Date(day.dt * 1000).toISOString(),
      day: formatDay(day.dt, data.timezone),
      high: day.temp.max,
      low: day.temp.min,
      dayTemp: day.temp.day,
      nightTemp: day.temp.night,
      icon: `https://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png`,
      shortForecast: day.weather[0].main,
      longForecast: day.summary,
      periods: [{
          startTime: new Date(day.dt * 1000).toISOString(),
          name: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' }),
          temperature: day.temp.day,
          temperatureUnit: 'F',
          windSpeed: `${Math.round(day.wind_speed)} mph`,
          windDirection: '',
          icon: `https://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png`,
          shortForecast: day.weather[0].main,
          detailedForecast: day.summary,
          humidity: day.humidity,
          pressure: day.pressure,
          sunrise: formatTime(day.sunrise, data.timezone),
          sunset: formatTime(day.sunset, data.timezone),
          feels_like: day.feels_like.day,
          isDaytime: true,
      }],
  }));

  const hourlyForecasts: HourlyForecast[] = data.hourly.map(hour => ({
    time: formatTime(hour.dt, data.timezone),
    temperature: hour.temp,
    icon: `https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`,
    date: new Date(hour.dt * 1000).toISOString().split('T')[0],
  }));

  return {
    location: {
      name: name,
      state: country, // Using state field for country
      lat: lat,
      lon: lon,
    },
    current: currentConditions,
    daily: dailyForecasts,
    hourly: hourlyForecasts,
  };
}
