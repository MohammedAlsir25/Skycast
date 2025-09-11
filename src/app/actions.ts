'use server';

import type { WeatherData } from '@/lib/types';

// Mock data to simulate OpenWeatherMap API responses
const MOCK_DATA: { [key: string]: WeatherData } = {
  london: {
    coord: { lon: -0.1257, lat: 51.5085 },
    weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
    base: 'stations',
    main: { temp: 15.1, feels_like: 14.5, temp_min: 13.8, temp_max: 16.7, pressure: 1012, humidity: 67 },
    visibility: 10000,
    wind: { speed: 4.63, deg: 240 },
    clouds: { all: 20 },
    dt: 1622376000,
    sys: { type: 2, id: 2019646, country: 'GB', sunrise: 1622346647, sunset: 1622402444 },
    timezone: 3600,
    id: 2643743,
    name: 'London',
    cod: 200,
  },
  paris: {
    coord: { lon: 2.3488, lat: 48.8534 },
    weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
    base: 'stations',
    main: { temp: 18.5, feels_like: 17.9, temp_min: 17, temp_max: 20, pressure: 1015, humidity: 55 },
    visibility: 10000,
    wind: { speed: 3.09, deg: 50 },
    clouds: { all: 0 },
    dt: 1622376000,
    sys: { type: 1, id: 6550, country: 'FR', sunrise: 1622346761, sunset: 1622401861 },
    timezone: 7200,
    id: 2988507,
    name: 'Paris',
    cod: 200,
  },
  tokyo: {
    coord: { lon: 139.6917, lat: 35.6895 },
    weather: [{ id: 500, main: 'Rain', description: 'light rain', icon: '10n' }],
    base: 'stations',
    main: { temp: 22.3, feels_like: 22.5, temp_min: 21, temp_max: 23, pressure: 1005, humidity: 88 },
    visibility: 10000,
    wind: { speed: 5.14, deg: 160 },
    clouds: { all: 75 },
    dt: 1622376000,
    sys: { type: 1, id: 8074, country: 'JP', sunrise: 1622316641, sunset: 1622368297 },
    timezone: 32400,
    id: 1850144,
    name: 'Tokyo',
    cod: 200,
  },
};

export async function getWeather(city: string): Promise<WeatherData> {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  if (apiKey) {
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

  // --- Mock implementation if API key is not available ---
  console.log('Using mock weather data. Set OPENWEATHERMAP_API_KEY for real data.');
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  const normalizedCity = city.toLowerCase();

  if (MOCK_DATA[normalizedCity]) {
    return MOCK_DATA[normalizedCity];
  }

  throw new Error('City not found');
}
