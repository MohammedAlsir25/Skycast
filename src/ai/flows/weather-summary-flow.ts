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
        You are a friendly and cheerful weather forecaster.
        Your goal is to provide a short, conversational summary of the day's weather for ${weatherData.location.name}.
        
        Start with a friendly greeting (e.g., "Good morning from ${weatherData.location.name}!").
        Briefly mention the general conditions (e.g., "sunny," "cloudy," "rainy") and the day's high temperature.
        End with a creative and relevant lifestyle suggestion based on the weather. For example, if it's sunny, suggest a walk in the park. If it's rainy, suggest a cozy day indoors with a movie.
                
        Keep your response to 2-3 sentences total. Be conversational and not overly robotic.

        Here is the weather data to use:
        - Today's High: ${weatherData.daily[0].high_f}°F / ${weatherData.daily[0].high_c}°C
        - General Forecast: ${weatherData.current.shortForecast}
        - Chance of Rain: ${weatherData.daily[0].periods[0].probabilityOfPrecipitation.value}%
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
