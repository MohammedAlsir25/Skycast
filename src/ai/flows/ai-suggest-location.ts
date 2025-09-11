'use server';

/**
 * @fileOverview AI-powered location suggestion flow.
 *
 * - suggestLocation - A function that suggests alternative locations using AI.
 * - SuggestLocationInput - The input type for the suggestLocation function.
 * - SuggestLocationOutput - The return type for the suggestLocation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestLocationInputSchema = z.object({
  city: z.string().describe('The city name entered by the user.'),
});
export type SuggestLocationInput = z.infer<typeof SuggestLocationInputSchema>;

const SuggestLocationOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of suggested alternative locations.'),
});
export type SuggestLocationOutput = z.infer<typeof SuggestLocationOutputSchema>;

export async function suggestLocation(input: SuggestLocationInput): Promise<SuggestLocationOutput> {
  return suggestLocationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestLocationPrompt',
  input: {schema: SuggestLocationInputSchema},
  output: {schema: SuggestLocationOutputSchema},
  prompt: `The user entered the city: {{{city}}}. This did not return accurate weather information.

Please suggest three alternative locations that the user may have intended. Return them as a JSON array of strings.
Ensure that the array only contains strings, where each string is a possible location.
`,
});

const suggestLocationFlow = ai.defineFlow(
  {
    name: 'suggestLocationFlow',
    inputSchema: SuggestLocationInputSchema,
    outputSchema: SuggestLocationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
