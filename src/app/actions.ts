'use server';

import type { WeatherData, DailyForecast, HourlyForecast, WeatherPeriod, WeatherAPIResponse } from '@/lib/types';

const API_KEY = process.env.WEATHERAPI_API_KEY;

export async function getWeather(city: string): Promise<WeatherData> {
    if (!API_KEY) {
        throw new Error("WeatherAPI.com API key is missing. Please add WEATHERAPI_API_KEY to your .env file.");
    }
    
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=7&aqi=no&alerts=no`;
    
    const response = await fetch(url, { headers: { 'User-Agent': 'Skycast Weather App' } });

    if (!response.ok) {
        if (response.status === 400) {
            const errorData = await response.json();
            throw new Error(errorData?.error?.message || `City "${city}" not found.`);
        }
        throw new Error('Failed to fetch weather data from WeatherAPI.com.');
    }

    const data: WeatherAPIResponse = await response.json();

    const currentConditions: WeatherPeriod = {
        number: 1,
        name: new Date(data.location.localtime).getHours() < 18 ? 'Today' : 'Tonight',
        startTime: new Date(data.current.last_updated_epoch * 1000).toISOString(),
        endTime: new Date(data.current.last_updated_epoch * 1000).toISOString(),
        isDaytime: !!data.current.is_day,
        temperature: data.current.temp_f,
        temperatureUnit: 'F',
        temperatureTrend: null,
        probabilityOfPrecipitation: { value: data.forecast.forecastday[0].day.daily_chance_of_rain },
        relativeHumidity: { value: data.current.humidity },
        windSpeed: `${data.current.wind_mph} mph`,
        windDirection: data.current.wind_dir,
        icon: `https:${data.current.condition.icon}`,
        shortForecast: data.current.condition.text,
        detailedForecast: data.current.condition.text,
    };

    const dailyForecasts: DailyForecast[] = data.forecast.forecastday.map(fd => ({
        date: fd.date,
        day: new Date(fd.date_epoch * 1000).toLocaleDateString('en-US', { weekday: 'short', timeZone: data.location.tz_id }),
        high: fd.day.maxtemp_f,
        low: fd.day.mintemp_f,
        icon: `https:${fd.day.condition.icon}`,
        shortForecast: fd.day.condition.text,
        periods: [
             {
                number: 1,
                name: 'Day',
                startTime: new Date(fd.date_epoch * 1000).toISOString(),
                endTime: new Date(fd.date_epoch * 1000).toISOString(),
                isDaytime: true,
                temperature: fd.day.maxtemp_f,
                temperatureUnit: 'F',
                temperatureTrend: null,
                probabilityOfPrecipitation: { value: fd.day.daily_chance_of_rain },
                relativeHumidity: { value: fd.day.avghumidity },
                windSpeed: `${fd.day.maxwind_mph} mph`,
                windDirection: '', 
                icon: `https:${fd.day.condition.icon}`,
                shortForecast: fd.day.condition.text,
                detailedForecast: fd.day.condition.text,
            }
        ],
    }));

    const hourlyForecasts: HourlyForecast[] = data.forecast.forecastday.flatMap(fd => 
        fd.hour.map(hour => ({
            time: new Date(hour.time_epoch * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, timeZone: data.location.tz_id }),
            temperature: hour.temp_f,
            icon: `https:${hour.condition.icon}`,
            date: fd.date,
        }))
    );

    return {
        location: {
            name: data.location.name,
            state: data.location.region,
            country: data.location.country,
            lat: data.location.lat,
            lon: data.location.lon,
        },
        current: currentConditions,
        daily: dailyForecasts,
        hourly: hourlyForecasts,
    };
}
