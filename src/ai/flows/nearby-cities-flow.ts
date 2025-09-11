'use server';

/**
 * @fileOverview A Genkit flow that finds nearby major cities for a given location.
 *
 * - findNearbyCities - A function that takes a location and returns a list of nearby city names.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const NearbyCitiesInputSchema = z.object({
  country: z.string().describe('The country to search for cities in.'),
  currentCity: z.string().describe('The current city, to be excluded from the results.'),
});
export type NearbyCitiesInput = z.infer<typeof NearbyCitiesInputSchema>;

const NearbyCitiesOutputSchema = z.object({
  cities: z.array(z.string()).describe('A list of 3-5 major city names in the given country, excluding the current city.'),
});
export type NearbyCitiesOutput = z.infer<typeof NearbyCitiesOutputSchema>;


export async function findNearbyCities(input: NearbyCitiesInput): Promise<NearbyCitiesOutput> {
  const result = await nearbyCitiesFlow(input);
  return result;
}

const nearbyCitiesFlow = ai.defineFlow(
  {
    name: 'nearbyCitiesFlow',
    inputSchema: NearbyCitiesInputSchema,
    outputSchema: NearbyCitiesOutputSchema,
  },
  async (input) => {
    const prompt = `
      You are a geography expert.
      Given the country "${input.country}", identify a list of 3 to 5 other major cities within that same country.
      Exclude the user's current city, "${input.currentCity}", from the list.
      Return only the list of city names.
    `;

    try {
      const { output } = await ai.generate({
        prompt: prompt,
        output: {
          schema: NearbyCitiesOutputSchema
        },
      });
      return output!;
    } catch (error) {
      console.error("AI nearby cities lookup failed:", error);
      // If the AI call fails, return an empty list.
      return { cities: [] };
    }
  }
);
