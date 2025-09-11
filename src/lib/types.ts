import { z } from 'zod';

// Zod Schemas for validation in Genkit flow
export const WeatherLocationSchema = z.object({
    name: z.string(),
    state: z.string(),
    country: z.string(),
    lat: z.number(),
    lon: z.number(),
    localtime: z.string(),
});

export const WeatherPeriodSchema = z.object({
    number: z.number(),
    name: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    isDaytime: z.boolean(),
    temperature_f: z.number(),
    temperature_c: z.number(),
    temperatureUnit: z.string(),
    temperatureTrend: z.string().nullable(),
    probabilityOfPrecipitation: z.object({
        value: z.number().nullable(),
    }),
    relativeHumidity: z.object({
        value: z.number().nullable(),
    }),
    windSpeed: z.string(),
    windDirection: z.string(),
    icon: z.string(),
    shortForecast: z.string(),
    detailedForecast: z.string(),
    uv: z.number().optional().nullable(),
});

export const DailyForecastSchema = z.object({
    date: z.string(),
    day: z.string(),
    high_f: z.number(),
    low_f: z.number(),
    high_c: z.number(),
    low_c: z.number(),
    icon: z.string(),
    shortForecast: z.string(),
    periods: z.array(WeatherPeriodSchema),
});

export const HourlyForecastSchema = z.object({
    time: z.string(),
    temperature_f: z.number(),
    temperature_c: z.number(),
    precip_chance: z.number(),
    humidity: z.number(),
    wind_mph: z.number(),
    icon: z.string(),
    date: z.string(),
    is_day: z.boolean(),
});

export const AirQualitySchema = z.object({
    usEpaIndex: z.number().optional(),
    label: z.string(),
    description: z.string(),
    color: z.string(),
});

export const WeatherAlertSchema = z.object({
    headline: z.string(),
    event: z.string(),
    effective: z.string(),
    expires: z.string(),
    desc: z.string(),
    instruction: z.string(),
});


export const WeatherDataSchema = z.object({
    location: WeatherLocationSchema,
    current: WeatherPeriodSchema,
    daily: z.array(DailyForecastSchema),
    hourly: z.array(HourlyForecastSchema),
    airQuality: AirQualitySchema.optional(),
    alerts: z.array(WeatherAlertSchema).optional(),
});

// TypeScript Types
export type WeatherLocation = z.infer<typeof WeatherLocationSchema>;
export type WeatherPeriod = z.infer<typeof WeatherPeriodSchema>;
export type DailyForecast = z.infer<typeof DailyForecastSchema>;
export type HourlyForecast = z.infer<typeof HourlyForecastSchema>;
export type AirQuality = z.infer<typeof AirQualitySchema>;
export type WeatherAlert = z.infer<typeof WeatherAlertSchema>;
export type WeatherData = z.infer<typeof WeatherDataSchema>;


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
        uv: number;
        air_quality?: {
            'us-epa-index': number;
        }
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
                uv: number;
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
                is_day: number;
                condition: {
                    text: string;
                    icon: string;
                };
                chance_of_rain: number;
                humidity: number;
                wind_mph: number;
            }[];
        }[];
    };
    alerts?: {
        alert: {
            headline: string;
            msgtype: string;
            severity: string;
            urgency: string;
            areas: string;
            category: string;
            certainty: string;
            event: string;
            note: string;
            effective: string;
            expires: string;
            desc: string;
            instruction: string;
        }[];
    }
}
