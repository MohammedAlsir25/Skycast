// Type for the data coming directly from the OpenWeatherMap /weather endpoint
export interface ApiWeatherData {
    coord: {
        lon: number;
        lat: number;
    };
    weather: WeatherInfo[];
    base: string;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
    };
    visibility: number;
    wind: {
        speed: number;
        deg: number;
    };
    clouds: {
        all: number;
    };
    dt: number;
    sys: {
        type: number;
        id: number;
        country: string;
        sunrise: number;
        sunset: number;
    };
    timezone: number;
    id: number;
    name: string;
    cod: number;
}


// Type for the data from the /forecast endpoint list
export interface ApiForecastListItem {
    dt: number;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        sea_level: number;
        grnd_level: number;
        humidity: number;
        temp_kf: number;
    };
    weather: WeatherInfo[];
    clouds: {
        all: number;
    };
    wind: {
        speed: number;
        deg: number;
        gust: number;
    };
    visibility: number;
    pop: number;
    sys: {
        pod: string;
    };
    dt_txt: string;
}

// Type for the overall data structure from the /forecast endpoint
export interface ApiForecastData {
    cod: string;
    message: number;
    cnt: number;
    list: ApiForecastListItem[];
    city: {
        id: number;
        name: string;
        coord: {
            lat: number;
            lon: number;
        };
        country: string;
        population: number;
        timezone: number;
        sunrise: number;
        sunset: number;
    };
}


export interface WeatherInfo {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeatherData {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  weather: WeatherInfo[];
}

export interface DailyWeatherData {
  dt: number;
  temp: {
    min: number;
    max: number;
  };
  weather: {
      icon: string;
      description: string;
  }[];
}

export interface WeatherData {
  current: CurrentWeatherData;
  daily: DailyWeatherData[];
  name: string;
  sys: {
    country: string;
  }
}
