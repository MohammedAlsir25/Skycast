'use server';

import type { WeatherData, DailyForecast, HourlyForecast, WeatherPeriod, WeatherAPIResponse, AirQuality, WeatherAlert } from '@/lib/types';

const API_KEY = process.env.WEATHERAPI_API_KEY;

const getAqiInfo = (index: number): { label: string; description: string; color: string } => {
    switch (index) {
        case 1: return { label: 'Good', description: 'Air quality is satisfactory, and air pollution poses little or no risk.', color: 'text-green-500' };
        case 2: return { label: 'Moderate', description: 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.', color: 'text-yellow-500' };
        case 3: return { label: 'Unhealthy for Sensitive Groups', description: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.', color: 'text-orange-500' };
        case 4: return { label: 'Unhealthy', description: 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.', color: 'text-red-500' };
        case 5: return { label: 'Very Unhealthy', description: 'Health alert: The risk of health effects is increased for everyone.', color: 'text-purple-500' };
        case 6: return { label: 'Hazardous', description: 'Health warning of emergency conditions: everyone is more likely to be affected.', color: 'text-maroon-500' }; // Assuming a maroon color might need to be configured in tailwind
        default: return { label: 'Unknown', description: 'AQI data is not available.', color: 'text-gray-500' };
    }
}


export async function getWeather(city: string): Promise<WeatherData> {
    if (!API_KEY) {
        throw new Error("WeatherAPI.com API key is missing. Please add WEATHERAPI_API_KEY to your .env file.");
    }
    
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=7&aqi=yes&alerts=yes`;
    
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
        temperature_f: data.current.temp_f,
        temperature_c: data.current.temp_c,
        temperatureUnit: 'F', // Default unit
        temperatureTrend: null,
        probabilityOfPrecipitation: { value: data.forecast.forecastday[0].day.daily_chance_of_rain },
        relativeHumidity: { value: data.current.humidity },
        windSpeed: `${data.current.wind_mph} mph`,
        windDirection: data.current.wind_dir,
        icon: `https:${data.current.condition.icon}`,
        shortForecast: data.current.condition.text,
        detailedForecast: data.current.condition.text,
        uv: data.current.uv,
    };

    const dailyForecasts: DailyForecast[] = data.forecast.forecastday.map(fd => ({
        date: fd.date,
        day: new Date(fd.date_epoch * 1000).toLocaleDateString('en-US', { weekday: 'short', timeZone: data.location.tz_id }),
        high_f: fd.day.maxtemp_f,
        low_f: fd.day.mintemp_f,
        high_c: fd.day.maxtemp_c,
        low_c: fd.day.mintemp_c,
        icon: `https:${fd.day.condition.icon}`,
        shortForecast: fd.day.condition.text,
        periods: [
             {
                number: 1,
                name: 'Day',
                startTime: new Date(fd.date_epoch * 1000).toISOString(),
                endTime: new Date(fd.date_epoch * 1000).toISOString(),
                isDaytime: true,
                temperature_f: fd.day.maxtemp_f,
                temperature_c: fd.day.maxtemp_c,
                temperatureUnit: 'F',
                temperatureTrend: null,
                probabilityOfPrecipitation: { value: fd.day.daily_chance_of_rain },
                relativeHumidity: { value: fd.day.avghumidity },
                windSpeed: `${fd.day.maxwind_mph} mph`,
                windDirection: '', 
                icon: `https:${fd.day.condition.icon}`,
                shortForecast: fd.day.condition.text,
                detailedForecast: fd.day.condition.text,
                uv: fd.day.uv,
            }
        ],
    }));

    const hourlyForecasts: HourlyForecast[] = data.forecast.forecastday.flatMap(fd => 
        fd.hour.map(hour => ({
            time: new Date(hour.time_epoch * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, timeZone: data.location.tz_id }),
            temperature_f: hour.temp_f,
            temperature_c: hour.temp_c,
            precip_chance: hour.chance_of_rain,
            humidity: hour.humidity,
            wind_mph: hour.wind_mph,
            icon: `https:${hour.condition.icon}`,
            date: fd.date,
            is_day: !!hour.is_day,
        }))
    );
    
    const usEpaIndex = data.current.air_quality?.['us-epa-index'];
    const aqiInfo = getAqiInfo(usEpaIndex);
    const airQuality: AirQuality = {
        usEpaIndex: usEpaIndex,
        ...aqiInfo,
    };

    const alerts: WeatherAlert[] = data.alerts?.alert?.map(a => ({
        headline: a.headline,
        event: a.event,
        effective: a.effective,
        expires: a.expires,
        desc: a.desc,
        instruction: a.instruction,
    })) || [];

    return {
        location: {
            name: data.location.name,
            state: data.location.region,
            country: data.location.country,
            lat: data.location.lat,
            lon: data.location.lon,
            localtime: data.location.localtime,
        },
        current: currentConditions,
        daily: dailyForecasts,
        hourly: hourlyForecasts,
        airQuality: airQuality,
        alerts: alerts,
    };
}
