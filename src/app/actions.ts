'use server';

import type { WeatherData, DailyForecast, HourlyForecast, WeatherPeriod } from '@/lib/types';

// Helper to get city and state from displayName
function getLocationFromName(displayName: string): { name: string; state: string } {
    const parts = displayName.split(', ');
    if (parts.length >= 2) {
        return { name: parts[0], state: parts[1] };
    }
    return { name: displayName, state: '' };
}


// weather.gov API requires a two-step process.
// 1. Get the forecast URLs from a lat/lon pair.
// 2. Fetch the actual forecast data from those URLs.
async function getForecastEndpoints(lat: number, lon: number): Promise<{ forecast: string; forecastHourly: string; timeZone: string; }> {
  const pointsUrl = `https://api.weather.gov/points/${lat.toFixed(4)},${lon.toFixed(4)}`;
  const pointsResponse = await fetch(pointsUrl, {
    headers: { 'User-Agent': '(weather-app, contact@example.com)' },
  });

  if (!pointsResponse.ok) {
    throw new Error('Could not retrieve forecast location. Please ensure the location is within the US.');
  }

  const pointsData = await pointsResponse.json();
  return {
    forecast: pointsData.properties.forecast,
    forecastHourly: pointsData.properties.forecastHourly,
    timeZone: pointsData.properties.timeZone,
  };
}


function groupForecastsByDay(periods: WeatherPeriod[], timeZone: string): DailyForecast[] {
  const daily: { [key: string]: { periods: WeatherPeriod[], high: number, low: number, icon: string } } = {};

  periods.forEach(period => {
    // Group periods by date, adjusted for the location's timezone
    const date = new Date(period.startTime).toLocaleDateString('en-US', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' });

    if (!daily[date]) {
      daily[date] = {
        periods: [],
        high: -Infinity,
        low: Infinity,
        icon: period.icon, // Use first icon of the day as a fallback
      };
    }

    daily[date].periods.push(period);
    if (period.isDaytime) {
        // Use daytime icon if available
        daily[date].icon = period.icon;
    }
    daily[date].high = Math.max(daily[date].high, period.temperature);
    daily[date].low = Math.min(daily[date].low, period.temperature);
  });

  // Convert the grouped object to an array and ensure we have min/max for each day
  return Object.entries(daily).map(([date, data]) => {
     // Find the absolute min/max from all periods for that day
    const allTemperatures = data.periods.map(p => p.temperature);
    const dayTemp = data.periods.find(p => p.isDaytime)?.temperature;
    const nightTemp = data.periods.find(p => !p.isDaytime)?.temperature;

    return {
      date,
      day: new Date(date).toLocaleDateString('en-US', { weekday: 'short', timeZone }),
      shortForecast: data.periods[0]?.shortForecast || '',
      longForecast: data.periods[0]?.detailedForecast || '',
      high: Math.max(...allTemperatures),
      low: Math.min(...allTemperatures),
      dayTemp: dayTemp,
      nightTemp: nightTemp,
      icon: data.icon,
      periods: data.periods,
    }
  }).slice(0, 7); // Return up to 7 days
}

export async function getWeather(city: string): Promise<WeatherData> {
  // Step 1: Geocode city name to get lat/lon. Using a free, open API.
  const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
  const geoResponse = await fetch(geoUrl, {
    headers: { 'User-Agent': '(weather-app, contact@example.com)' }
  });

  if (!geoResponse.ok) {
    throw new Error('Failed to fetch location data.');
  }

  const geoData = await geoResponse.json();
  if (geoData.length === 0) {
    throw new Error(`City "${city}" not found.`);
  }

  const { lat, lon, display_name } = geoData[0];
  const { name, state } = getLocationFromName(display_name);

  // Step 2: Get forecast URLs from weather.gov
  const endpoints = await getForecastEndpoints(parseFloat(lat), parseFloat(lon));

  // Step 3: Fetch both daily and hourly forecasts in parallel
  const [dailyResponse, hourlyResponse] = await Promise.all([
    fetch(endpoints.forecast, { headers: { 'User-Agent': '(weather-app, contact@example.com)' } }),
    fetch(endpoints.forecastHourly, { headers: { 'User-Agent': '(weather-app, contact@example.com)' } }),
  ]);

  if (!dailyResponse.ok) throw new Error('Failed to fetch daily forecast.');
  if (!hourlyResponse.ok) throw new Error('Failed to fetch hourly forecast.');

  const dailyData = await dailyResponse.json();
  const hourlyData = await hourlyResponse.json();

  // Step 4: Process and combine the data
  const dailyForecasts = groupForecastsByDay(dailyData.properties.periods, endpoints.timeZone);

  const hourlyForecasts: HourlyForecast[] = hourlyData.properties.periods.map((p: any) => ({
    time: new Date(p.startTime).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, timeZone: endpoints.timeZone }),
    temperature: p.temperature,
    icon: p.icon,
  })).slice(0, 24); // next 24 hours

  const currentConditions = dailyData.properties.periods[0];

  return {
    location: {
      name: name,
      state: state,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
    },
    current: {
        ...currentConditions,
        temperature: currentConditions.temperature,
        humidity: { value: currentConditions.relativeHumidity.value } // Manually map humidity
    },
    daily: dailyForecasts,
    hourly: hourlyForecasts,
  };
}
