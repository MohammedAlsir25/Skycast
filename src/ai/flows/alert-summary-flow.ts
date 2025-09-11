'use server';

/**
 * @fileOverview A Genkit flow that summarizes a weather alert into actionable advice.
 *
 * - summarizeAlert - A function that takes a weather alert and returns a simple summary.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { WeatherAlert } from '@/lib/types';
import { WeatherAlertSchema } from '@/lib/types';


const AlertSummaryOutputSchema = z.object({
  summary: z.string().describe('A short (2-3 sentences max), actionable summary of the weather alert. Focus on what the user should do. For example: "Heavy rain is expected. Avoid travel if possible and be aware of potential flooding." or "High winds are forecasted. Secure loose outdoor objects and be cautious of falling debris."'),
});
export type AlertSummaryOutput = z.infer<typeof AlertSummaryOutputSchema>;

export async function summarizeAlert(alert: WeatherAlert): Promise<AlertSummaryOutput> {
  return await alertSummaryFlow(alert);
}

const alertSummaryFlow = ai.defineFlow(
  {
    name: 'alertSummaryFlow',
    inputSchema: WeatherAlertSchema,
    outputSchema: AlertSummaryOutputSchema,
  },
  async (alert) => {
    const prompt = `
      You are a helpful assistant that provides clear, actionable advice based on weather alerts.
      Summarize the following weather alert into a short, easy-to-understand recommendation of 2-3 sentences.
      Focus on what the user should do or avoid.

      Alert Details:
      - Event: ${alert.event}
      - Headline: ${alert.headline}
      - Description: ${alert.desc}
      - Instruction: ${alert.instruction}
    `;
    
    try {
      const { output } = await ai.generate({
        prompt,
        output: {
          schema: AlertSummaryOutputSchema,
        },
      });
      return output!;
    } catch (error) {
       console.error("AI alert summary failed, returning default instruction.", error);
       // If the AI call fails, return the official instruction or a generic message.
       return { summary: alert.instruction || "Please read the official alert for instructions." };
    }
  }
);
