'use server';

/**
 * @fileOverview A Genkit flow that generates a clothing recommendation based on weather data.
 *
 * - getClothingRecommendation - A function that takes weather data and returns a clothing suggestion.
 */
import { ai } from '@/ai/genkit';
import { WeatherDataSchema } from '@/lib/types';
import type { WeatherData } from '@/lib/types';
import { z } from 'zod';

export async function getClothingRecommendation(data: WeatherData): Promise<string> {
  const result = await clothingRecommendationFlow(data);
  return result.recommendation;
}

const ClothingRecommendationSchema = z.object({
  recommendation: z.string().describe('A short, friendly, and practical clothing recommendation based on the weather. For example: "It\'s a warm day, so shorts and a t-shirt are perfect." or "A winter coat, hat, and gloves are a must today!". Keep it to a single sentence.'),
});

const clothingRecommendationFlow = ai.defineFlow(
  {
    name: 'clothingRecommendationFlow',
    inputSchema: WeatherDataSchema,
    outputSchema: ClothingRecommendationSchema,
  },
  async (weatherData) => {
    const prompt = `
        You are a helpful assistant providing clothing advice based on the weather.
        The user is in ${weatherData.location.name}.
        Here is the weather forecast:
        - Current Temperature: ${weatherData.current.temperature_f}°F / ${weatherData.current.temperature_c}°C
        - Today's High: ${weatherData.daily[0].high_f}°F
        - Today's Low: ${weatherData.daily[0].low_f}°F
        - Forecast: ${weatherData.current.shortForecast}
        - Chance of Rain: ${weatherData.daily[0].periods[0].probabilityOfPrecipitation.value}%
        - Wind: ${weatherData.current.windSpeed}

        Based on this, provide a short, friendly, and practical clothing recommendation.
        Keep it to a single sentence.
      `;

    const { output } = await ai.generate({
      prompt: prompt,
      output: {
        schema: ClothingRecommendationSchema
      },
    });

    return output!;
  }
);
