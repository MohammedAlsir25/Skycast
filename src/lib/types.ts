// Generic types for the application data structure
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
    value: number | null;
  };
  relativeHumidity: {
    unitCode: string;
    value: number | null;
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
  icon: string;
  shortForecast: string;
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


// Types for weather.gov API responses
export interface WeatherGovPointResponse {
    "@context": [string, { "@version": string, "wx": string, "s": string, "geo": string, "unit": string, "vocab": string }];
    id: string;
    type: string;
    geometry: {
        type: string;
        coordinates: [number, number];
    };
    properties: WeatherGovGridResponse;
}

export interface WeatherGovGridResponse {
    "@id": string;
    "@type": string;
    cwa: string;
    forecastOffice: string;
    gridId: string;
    gridX: number;
    gridY: number;
    forecast: string;
    forecastHourly: string;
    forecastGridData: string;
    observationStations: string;
    relativeLocation: {
        type: string;
        geometry: {
            type: string;
            coordinates: [number, number];
        };
        properties: {
            city: string;
            state: string;
            distance: {
                unitCode: string;
                value: number;
            };
            bearing: {
                unitCode: string;
                value: number;
            };
        };
    };
    forecastZone: string;
    county: string;
    fireWeatherZone: string;
    timeZone: string;
    radarStation: string;
}

export interface WeatherGovPeriodsResponse {
    properties: {
        updated: string;
        units: string;
        forecastGenerator: string;
        generatedAt: string;
        updateTime: string;
        validTimes: string;
        elevation: {
            unitCode: string;
            value: number;
        };
        periods: WeatherPeriod[];
    };
}
