
export interface WeatherLocation {
  name: string;
  state: string; // Used for country
  lat: number;
  lon: number;
}

export interface WeatherPeriod {
  startTime: string;
  name: string;
  temperature: number;
  temperatureUnit: string;
  windSpeed: string;
  windDirection: string;
  icon: string;
  shortForecast: string;
  detailedForecast: string;
  isDaytime: boolean;
  
  // From OpenWeatherMap
  humidity?: number | null;
  pressure?: number | null;
  visibility?: number | null;
  sunrise?: string | null;
  sunset?: string | null;
  feels_like?: number | null;
}

export interface DailyForecast {
  date: string;
  day: string;
  high: number;
  low: number;
  dayTemp?: number;
  nightTemp?: number;
  icon: string;
  shortForecast: string;
  longForecast: string;
  periods: WeatherPeriod[];
}

export interface HourlyForecast {
    time: string;
    temperature: number;
    icon: string;
    date: string; // YYYY-MM-DD to filter by day
}


export interface WeatherData {
  location: WeatherLocation;
  current: WeatherPeriod;
  daily: DailyForecast[];
  hourly: HourlyForecast[];
}

// Type definitions for OpenWeatherMap One Call API response
export interface OpenWeatherOneCallResponse {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: {
    dt: number;
    sunrise: number;
    sunset: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
  };
  hourly: {
    dt: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust: number;
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    pop: number;
  }[];
  daily: {
    dt: number;
    sunrise: number;
    sunset: number;
    moonrise: number;
    moonset: number;
    moon_phase: number;
    summary: string;
    temp: {
      day: number;
      min: number;
      max: number;
      night: number;
      eve: number;
      morn: number;
    };
    feels_like: {
      day: number;
      night: number;
      eve: number;
      morn: number;
    };
    pressure: number;
    humidity: number;
    dew_point: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust: number;
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    clouds: number;
    pop: number;
    uvi: number;
  }[];
}
