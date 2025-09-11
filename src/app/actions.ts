'use server';

import type { WeatherData, ApiWeatherData, ApiForecastData, DailyWeatherData } from '@/lib/types';

function processForecastData(forecastData: ApiForecastData): DailyWeatherData[] {
    const dailyData: { [key: string]: { temps: number[], weather: any[], icon?: string } } = {};

    forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000).toISOString().split('T')[0];
        if (!dailyData[date]) {
            dailyData[date] = { temps: [], weather: [] };
        }
        dailyData[date].temps.push(item.main.temp);
        dailyData[date].weather.push(item.weather[0]);

        // Capture the icon for the midday forecast if available
        const hour = new Date(item.dt * 1000).getUTCHours();
        if (hour >= 12 && hour < 15) {
            dailyData[date].icon = item.weather[0].icon;
        }
    });

    const daily: DailyWeatherData[] = Object.keys(dailyData).map(date => {
        const day = dailyData[date];
        const min = Math.min(...day.temps);
        const max = Math.max(...day.temps);
        // If no midday icon was found, take the most frequent one or the first one.
        const icon = day.icon || day.weather.reduce((acc, c) => {
            acc[c.icon] = (acc[c.icon] || 0) + 1;
            return acc;
        }, {} as {[key: string]: number});
        
        const finalIcon = typeof icon === 'string' ? icon : Object.keys(icon).reduce((a, b) => icon[a] > icon[b] ? a : b);

        return {
            dt: new Date(date).getTime() / 1000,
            temp: {
                min: min,
                max: max,
            },
            weather: [{
                icon: finalIcon,
                description: day.weather[0].description // Take description from first entry
            }]
        };
    }).slice(0, 7); // Return forecast for the next 7 days

    return daily;
}


export async function getWeather(city: string): Promise<WeatherData> {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    throw new Error('Missing OpenWeatherMap API Key. Please add it to your .env file. You can get a free key from https://home.openweathermap.org/users/sign_up');
  }
  
  // Fetch current weather
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const weatherResponse = await fetch(weatherUrl);
  if (!weatherResponse.ok) {
    if(weatherResponse.status === 404) {
      throw new Error(`City "${city}" not found.`);
    } else {
      throw new Error('Failed to fetch current weather data');
    }
  }
  const currentData: ApiWeatherData = await weatherResponse.json();

  // Fetch 5-day forecast
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  const forecastResponse = await fetch(forecastUrl);
   if (!forecastResponse.ok) {
    throw new Error('Failed to fetch forecast data');
  }
  const forecastData: ApiForecastData = await forecastResponse.json();

  const dailyForecast = processForecastData(forecastData);

  return {
    current: {
      dt: currentData.dt,
      sunrise: currentData.sys.sunrise,
      sunset: currentData.sys.sunset,
      temp: currentData.main.temp,
      feels_like: currentData.main.feels_like,
      pressure: currentData.main.pressure,
      humidity: currentData.main.humidity,
      visibility: currentData.visibility,
      wind_speed: currentData.wind.speed,
      wind_deg: currentData.wind.deg,
      weather: currentData.weather,
      clouds: currentData.clouds.all
    },
    daily: dailyForecast,
    name: currentData.name,
    sys: {
      country: currentData.sys.country
    }
  };
}
