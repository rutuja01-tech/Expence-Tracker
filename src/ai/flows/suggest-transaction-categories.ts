'use server';
/**
 * @fileOverview A Genkit flow that suggests transaction categories based on transaction title and notes.
 *
 * - suggestTransactionCategories - A function that suggests categories for a transaction.
 * - SuggestTransactionCategoriesInput - The input type for the suggestTransactionCategories function.
 * - SuggestTransactionCategoriesOutput - The return type for the suggestTransactionCategories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTransactionCategoriesInputSchema = z.object({
  title: z.string().describe('The title or name of the transaction.'),
  notes: z
    .string()
    .optional()
    .describe('Additional notes or description for the transaction.'),
});
export type SuggestTransactionCategoriesInput = z.infer<
  typeof SuggestTransactionCategoriesInputSchema
>;

const SuggestTransactionCategoriesOutputSchema = z.object({
  suggestedCategories: z
    .array(z.string())
    .describe('A list of suggested categories for the transaction.'),
});
export type SuggestTransactionCategoriesOutput = z.infer<
  typeof SuggestTransactionCategoriesOutputSchema
>;

export async function suggestTransactionCategories(
  input: SuggestTransactionCategoriesInput
): Promise<SuggestTransactionCategoriesOutput> {
  return suggestTransactionCategoriesFlow(input);
}

const suggestTransactionCategoriesPrompt = ai.definePrompt({
  name: 'suggestTransactionCategoriesPrompt',
  input: {schema: SuggestTransactionCategoriesInputSchema},
  output: {schema: SuggestTransactionCategoriesOutputSchema},
  prompt: `You are an AI financial assistant. Your task is to suggest a list of relevant categories for a user's financial transaction based on its title and any associated notes.

Consider common financial categories such as: Food, Transport, Utilities, Entertainment, Shopping, Rent, Salary, Healthcare, Education, Groceries, Dining Out, Travel, Bills, Income, Savings, Investments, Gifts, Personal Care, Technology, Home Improvement, Subscriptions.

Transaction Title: {{{title}}}
{{#if notes}}Notes: {{{notes}}}{{/if}}

Provide at least 3 relevant categories, ordered from most to least relevant. Your response should only contain the JSON array of categories.`,
});

const suggestTransactionCategoriesFlow = ai.defineFlow(
  {
    name: 'suggestTransactionCategoriesFlow',
    inputSchema: SuggestTransactionCategoriesInputSchema,
    outputSchema: SuggestTransactionCategoriesOutputSchema,
  },
  async input => {
    const {output} = await suggestTransactionCategoriesPrompt(input);
    return output!;
  }
);
