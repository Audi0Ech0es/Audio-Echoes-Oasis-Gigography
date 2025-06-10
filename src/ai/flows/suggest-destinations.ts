// src/ai/flows/suggest-destinations.ts
'use server';

/**
 * @fileOverview Implements an AI-powered location suggestion flow. It takes a partial location input and
 * suggests possible destinations based on historical tour data.
 *
 * - suggestDestinations - The main function that handles the location suggestion process.
 * - SuggestDestinationsInput - The input type for the suggestDestinations function.
 * - SuggestDestinationsOutput - The return type for the suggestDestinations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDestinationsInputSchema = z.object({
  partialLocation: z
    .string()
    .describe('A partial location string (city, country, or venue) to complete.'),
});
export type SuggestDestinationsInput = z.infer<typeof SuggestDestinationsInputSchema>;

const SuggestDestinationsOutputSchema = z.object({
  suggestions: z.array(
    z.string().describe('An array of suggested destinations based on the input.')
  ),
});
export type SuggestDestinationsOutput = z.infer<typeof SuggestDestinationsOutputSchema>;

export async function suggestDestinations(input: SuggestDestinationsInput): Promise<SuggestDestinationsOutput> {
  return suggestDestinationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDestinationsPrompt',
  input: {schema: SuggestDestinationsInputSchema},
  output: {schema: SuggestDestinationsOutputSchema},
  prompt: `You are a tour destination suggestion AI.

You will receive a partial location string, and must return an array of suggested destinations based on that string.

Partial Location: {{{partialLocation}}}

Consider these possible matches (this list is not exhaustive, but represents all the cities, countries and venues this tour has visited):
Los Angeles, USA, Hollywood Bowl, London, UK, Wembley Stadium, Paris, France, Accor Arena, Berlin, Germany, Mercedes-Benz Arena, Tokyo, Japan, Tokyo Dome.

Return your response as a JSON array of strings.

For example, if the partial location is "L", your response should be ["Los Angeles", "London"].  If the partial location is "USA", your response should be ["USA", "Los Angeles"]. If the partial location is "France", your response should be ["France", "Paris"].  If the partial location is "Wem", your response should be ["Wembley Stadium"].

Be as inclusive as possible, and do not leave out any possible matches.
`,
});

const suggestDestinationsFlow = ai.defineFlow(
  {
    name: 'suggestDestinationsFlow',
    inputSchema: SuggestDestinationsInputSchema,
    outputSchema: SuggestDestinationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
