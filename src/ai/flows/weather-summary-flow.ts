'use server';

/**
 * @fileOverview A Genkit flow that generates a human-readable weather summary.
 *
 * - summarizeWeather - A function that takes weather data and returns a string summary.
 */
import { ai } from '@/ai/genkit';
import { WeatherDataSchema } from '@/lib/types';
import type { WeatherData } from '@/lib/types';
import { z } from 'zod';

export async function summarizeWeather(data: WeatherData): Promise<string> {
  const result = await summarizeWeatherFlow(data);
  return result.summary;
}

const WeatherSummarySchema = z.object({
  summary: z.string().describe('A short, conversational, and friendly summary of the weather. Use a friendly tone and mention the location. Keep it to 2-3 sentences.'),
});

const summarizeWeatherFlow = ai.defineFlow(
  {
    name: 'summarizeWeatherFlow',
    inputSchema: WeatherDataSchema,
    outputSchema: WeatherSummarySchema,
  },
  async (weatherData) => {
    const prompt = `
        You are a friendly weather forecaster.
        Given the following weather data for ${weatherData.location.name}, provide a short, conversational summary.
        Mention the current temperature, the high and low for the day, and the general conditions (e.g., "clear skies," "expect some rain").
        Keep it to a maximum of 3 sentences.

        Current Temperature: ${weatherData.current.temperature_f}°F / ${weatherData.current.temperature_c}°C
        Today's High: ${weatherData.daily[0].high_f}°F / ${weatherData.daily[0].high_c}°C
        Today's Low: ${weatherData.daily[0].low_f}°F / ${weatherData.daily[0].low_c}°C
        Forecast: ${weatherData.current.shortForecast}
        Chance of Rain: ${weatherData.daily[0].periods[0].probabilityOfPrecipitation.value}%
      `;

    const { output } = await ai.generate({
      prompt: prompt,
      output: {
        schema: WeatherSummarySchema
      },
    });

    return output!;
  }
);
