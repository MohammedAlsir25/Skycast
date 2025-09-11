// types.ts

export interface WeatherLocation {
  name: string;
  state: string;
  lat: number;
  lon: number;
}

export interface WeatherPeriod {
  number: number;
  name: string;
  startTime: string;
  endTime: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: string;
  temperatureTrend: string | null;
  probabilityOfPrecipitation: {
    unitCode: string;
    value: number | null;
  };
  dewpoint: {
    unitCode: string;
    value: number;
  };
  relativeHumidity: {
    unitCode: string;
    value: number;
  };
  windSpeed: string;
  windDirection: string;
  icon: string;
  shortForecast: string;
  detailedForecast: string;
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
}


export interface WeatherData {
  location: WeatherLocation;
  current: WeatherPeriod;
  daily: DailyForecast[];
  hourly: HourlyForecast[];
}
