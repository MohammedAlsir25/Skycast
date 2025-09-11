'use server';

import type { WeatherData, DailyForecast, HourlyForecast, WeatherPeriod, WeatherGovPeriodsResponse, WeatherGovGridResponse, WeatherGovPointResponse } from '@/lib/types';

// Helper to get city and state from displayName
function getLocationFromName(displayName: string): { name: string; state: string } {
    const parts = displayName.split(', ');
    if (parts.length >= 2) {
        return { name: parts[0], state: parts[1] };
    }
    return { name: displayName, state: '' };
}

async function getCoordinates(city: string): Promise<{ lat: number; lon: number, name: string, state: string }> {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1&countrycodes=us`;
    const response = await fetch(url, { headers: { 'User-Agent': 'Skycast Weather App' } });

    if (!response.ok) {
        throw new Error('Failed to fetch location data from Nominatim.');
    }

    const data = await response.json();
    if (data.length === 0) {
        throw new Error(`City "${city}" not found.`);
    }

    const { lat, lon, display_name } = data[0];
    const { name, state } = getLocationFromName(display_name);

    return { lat: parseFloat(lat), lon: parseFloat(lon), name, state };
}

async function getGridEndpoints(lat: number, lon: number): Promise<WeatherGovGridResponse> {
    const url = `https://api.weather.gov/points/${lat.toFixed(4)},${lon.toFixed(4)}`;
    const response = await fetch(url, { headers: { 'User-Agent': 'Skycast Weather App' } });

    if (!response.ok) {
        if (response.status === 404) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Could not find a weather station for the provided coordinates.');
        }
        throw new Error('Failed to fetch grid endpoints from weather.gov API.');
    }

    const data: WeatherGovPointResponse = await response.json();
    return data.properties;
}

export async function getWeather(city: string): Promise<WeatherData> {
    const { lat, lon, name, state } = await getCoordinates(city);
    const gridEndpoints = await getGridEndpoints(lat, lon);
    const forecastUrl = gridEndpoints.forecast;
    const forecastHourlyUrl = gridEndpoints.forecastHourly;

    const [forecastResponse, hourlyResponse] = await Promise.all([
        fetch(forecastUrl, { headers: { 'User-Agent': 'Skycast Weather App' } }),
        fetch(forecastHourlyUrl, { headers: { 'User-Agent': 'Skycast Weather App' } })
    ]);

    if (!forecastResponse.ok) {
        throw new Error('Failed to fetch daily forecast data from weather.gov.');
    }
    if (!hourlyResponse.ok) {
        throw new Error('Failed to fetch hourly forecast data from weather.gov.');
    }

    const forecastData: WeatherGovPeriodsResponse = await forecastResponse.json();
    const hourlyData: WeatherGovPeriodsResponse = await hourlyResponse.json();

    const { periods } = forecastData.properties;
    const { periods: hourlyPeriods } = hourlyData.properties;
    
    if (!periods || periods.length === 0) {
        throw new Error("No forecast data available.");
    }

    const currentConditions = periods[0];
    const dailyForecasts: DailyForecast[] = [];
    const processedDays = new Set<string>();

    for (const period of periods) {
        const date = new Date(period.startTime).toLocaleDateString('en-US', { timeZone: gridEndpoints.timeZone });
        if (processedDays.has(date)) continue;

        const dayPeriods = periods.filter(p => new Date(p.startTime).toLocaleDateString('en-US', { timeZone: gridEndpoints.timeZone }) === date);
        const dayPeriod = dayPeriods.find(p => p.isDaytime) || dayPeriods[0];
        const nightPeriod = dayPeriods.find(p => !p.isDaytime);

        dailyForecasts.push({
            date: new Date(dayPeriod.startTime).toISOString(),
            day: new Date(dayPeriod.startTime).toLocaleDateString('en-US', { weekday: 'short', timeZone: gridEndpoints.timeZone }),
            high: dayPeriod.temperature,
            low: nightPeriod?.temperature ?? dayPeriod.temperature,
            icon: dayPeriod.icon,
            shortForecast: dayPeriod.shortForecast,
            periods: dayPeriods,
        });
        processedDays.add(date);
    }

    const hourlyForecasts: HourlyForecast[] = hourlyPeriods.map(period => ({
        time: new Date(period.startTime).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, timeZone: gridEndpoints.timeZone }),
        temperature: period.temperature,
        icon: period.icon,
        date: new Date(period.startTime).toISOString().split('T')[0],
    }));

    return {
        location: {
            name: name,
            state: state,
            lat,
            lon,
        },
        current: currentConditions,
        daily: dailyForecasts.slice(0, 7),
        hourly: hourlyForecasts,
    };
}
