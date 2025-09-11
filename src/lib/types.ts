// Types for WeatherAPI.com
export interface WeatherLocation {
    name: string;
    state: string;
    country: string;
    lat: number;
    lon: number;
}

export interface WeatherPeriod {
    number: number;
    name: string;
    startTime: string;
    endTime: string;
    isDaytime: boolean;
    temperature_f: number;
    temperature_c: number;
    temperatureUnit: string;
    temperatureTrend: string | null;
    probabilityOfPrecipitation: {
        value: number | null;
    };
    relativeHumidity: {
        value: number | null;
    };
    windSpeed: string;
    windDirection: string;
    icon: string;
    shortForecast: string;
    detailedForecast: string;
}

export interface DailyForecast {
    date: string; // YYYY-MM-DD
    day: string; // "Sun", "Mon", etc.
    high_f: number;
    low_f: number;
    high_c: number;
    low_c: number;
    icon: string;
    shortForecast: string;
    periods: WeatherPeriod[];
}

export interface HourlyForecast {
    time: string; // "1 AM", "2 AM", etc.
    temperature_f: number;
    temperature_c: number;
    icon: string;
    date: string; // YYYY-MM-DD
}

export interface WeatherData {
    location: WeatherLocation;
    current: WeatherPeriod;
    daily: DailyForecast[];
    hourly: HourlyForecast[];
}


// API Response Types
export interface WeatherAPIResponse {
    location: {
        name: string;
        region: string;
        country: string;
        lat: number;
        lon: number;
        tz_id: string;
        localtime_epoch: number;
        localtime: string;
    };
    current: {
        last_updated_epoch: number;
        temp_f: number;
        temp_c: number;
        is_day: number;
        condition: {
            text: string;
            icon: string;
        };
        wind_mph: number;
        wind_dir: string;
        humidity: number;
    };
    forecast: {
        forecastday: {
            date: string;
            date_epoch: number;
            day: {
                maxtemp_f: number;
                mintemp_f: number;
                maxtemp_c: number;
                mintemp_c: number;
                maxwind_mph: number;
                avghumidity: number;
                daily_chance_of_rain: number;
                condition: {
                    text: string;
                    icon: string;
                };
            };
            hour: {
                time_epoch: number;
                time: string;
                temp_f: number;
                temp_c: number;
                condition: {
                    text: string;
                    icon: string;
                };
            }[];
        }[];
    };
}
