'use server';

/**
 * @fileOverview A flow to automatically detect the format of the input data.
 *
 * - detectFormat - A function that detects the format of the input data.
 * - DetectFormatInput - The input type for the detectFormat function.
 * - DetectFormatOutput - The return type for the detectFormat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectFormatInputSchema = z.object({
  inputData: z.string().describe('The input data to detect the format of.'),
});
export type DetectFormatInput = z.infer<typeof DetectFormatInputSchema>;

const DetectFormatOutputSchema = z.object({
  format: z
    .string()
    .describe(
      'The detected format of the input data (e.g., JSON, YAML, XML).' + 
      ' If format cannot be reliably detected, return null.'
    )
    .nullable(),
  confidence: z
    .number()
    .describe('A confidence score between 0 and 1 indicating the certainty of the format detection.')
    .nullable(),
});
export type DetectFormatOutput = z.infer<typeof DetectFormatOutputSchema>;

export async function detectFormat(input: DetectFormatInput): Promise<DetectFormatOutput> {
  return detectFormatFlow(input);
}

const detectFormatPrompt = ai.definePrompt({
  name: 'detectFormatPrompt',
  input: {schema: DetectFormatInputSchema},
  output: {schema: DetectFormatOutputSchema},
  prompt: `Determine the format of the following input data. Return null for the format if you cannot determine the input with reasonable confidence.

Input Data:
{{{inputData}}}

Consider these formats:
- JSON
- YAML
- XML

Output a confidence between 0 and 1 indicating how certain you are of the format. For example, if the format contains a structured format and you are certain, it will be closer to 1, otherwise if the format is ambiguous, it should be closer to 0. If you return null for the format, then you should also return null for the confidence.`, 
});

const detectFormatFlow = ai.defineFlow(
  {
    name: 'detectFormatFlow',
    inputSchema: DetectFormatInputSchema,
    outputSchema: DetectFormatOutputSchema,
  },
  async input => {
    const {output} = await detectFormatPrompt(input);
    return output!;
  }
);
