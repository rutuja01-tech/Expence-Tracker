'use server';
/**
 * @fileOverview An AI-powered transaction search agent.
 *
 * - searchTransactions - A function that searches transactions based on a natural language query.
 * - SearchTransactionsInput - The input type for the searchTransactions function.
 * - SearchTransactionsOutput - The return type for the searchTransactions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Defines the structure for a single transaction. This schema is reused for both input and output.
const TransactionSchema = z.object({
  id: z.string().describe('Unique identifier for the transaction.'),
  title: z.string().describe('A brief title for the transaction.'),
  amount: z.number().describe('The monetary amount of the transaction.'),
  category: z.string().describe('The category of the transaction (e.g., Food, Transport).'),
  date: z.string().describe('The date of the transaction in ISO 8601 format (YYYY-MM-DD).'),
  notes: z.string().optional().describe('Optional additional notes for the transaction.'),
});

// Input schema for the searchTransactions flow.
const SearchTransactionsInputSchema = z.object({
  query: z.string().describe('The natural language query for searching transactions (e.g., "Show me where I spent money on dining out last month").'),
  transactions: z.array(TransactionSchema).describe('A list of all available transactions to search within.'),
});
export type SearchTransactionsInput = z.infer<typeof SearchTransactionsInputSchema>;

// Output schema for the searchTransactions flow.
const SearchTransactionsOutputSchema = z.object({
  filteredTransactions: z.array(TransactionSchema).describe('The list of transactions that match the search query criteria.'),
});
export type SearchTransactionsOutput = z.infer<typeof SearchTransactionsOutputSchema>;

/**
 * Searches through a list of transactions based on a natural language query.
 * The AI interprets the query to extract filtering criteria and applies them to the transactions.
 * @param input - An object containing the natural language query and the list of transactions.
 * @returns A promise that resolves to an object containing the filtered transactions.
 */
export async function searchTransactions(
  input: SearchTransactionsInput
): Promise<SearchTransactionsOutput> {
  return searchTransactionsFlow(input);
}

// Schema for the filter criteria extracted by the LLM from the natural language query.
const TransactionFilterSchema = z.object({
  textSearch: z.string().optional().describe('Keywords to search in transaction titles and notes (case-insensitive).'),
  category: z.string().optional().describe('Specific category to filter transactions by (case-insensitive).'),
  minAmount: z.number().optional().describe('Minimum amount for transactions.'),
  maxAmount: z.number().optional().describe('Maximum amount for transactions.'),
  startDate: z.string().optional().describe('Start date for filtering transactions, in ISO 8601 format (YYYY-MM-DD).'),
  endDate: z.string().optional().describe('End date for filtering transactions, in ISO 8601 format (YYYY-MM-DD).'),
});
type TransactionFilter = z.infer<typeof TransactionFilterSchema>; // Internal type for prompt output

// Genkit prompt to extract structured filter criteria from a natural language query.
const extractFiltersPrompt = ai.definePrompt({
  name: 'extractTransactionFiltersPrompt',
  input: { schema: z.object({ query: z.string() }) },
  output: { schema: TransactionFilterSchema },
  prompt: `You are an AI assistant specialized in interpreting natural language queries for financial transactions.
Your task is to extract filtering criteria from the user's query and output them in a structured JSON format.
Do NOT perform the filtering yourself. Just extract the criteria.

Available filter fields:
- textSearch: Keywords to search within transaction titles and notes.
- category: A specific category (e.g., "Food", "Transport").
- minAmount: Minimum transaction amount.
- maxAmount: Maximum transaction amount.
- startDate: Start date in ISO 8601 format (YYYY-MM-DD). Convert relative terms like "last month" or "yesterday" to concrete YYYY-MM-DD dates.
- endDate: End date in ISO 8601 format (YYYY-MM-DD). Convert relative terms like "last month" or "yesterday" to concrete YYYY-MM-DD dates.

If a filter is not mentioned or implied in the query, do not include it in the output.
When extracting dates, assume the current date is today, if needed to resolve relative dates. The current date is ${new Date().toISOString().split('T')[0]}.

User query: "{{{query}}}"

Output the extracted filters as a JSON object:`,
});

// Genkit flow to perform AI-powered transaction search.
const searchTransactionsFlow = ai.defineFlow(
  {
    name: 'aiPoweredTransactionSearchFlow',
    inputSchema: SearchTransactionsInputSchema,
    outputSchema: SearchTransactionsOutputSchema,
  },
  async (input) => {
    const { query, transactions } = input;

    // Use the prompt to extract filter criteria from the natural language query.
    const { output: filters } = await extractFiltersPrompt({ query });

    let filtered = transactions;

    // Apply text search filter if provided.
    if (filters?.textSearch) {
      const searchTerm = filters.textSearch.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(searchTerm) ||
          (t.notes && t.notes.toLowerCase().includes(searchTerm))
      );
    }

    // Apply category filter if provided.
    if (filters?.category) {
      const searchCategory = filters.category.toLowerCase();
      filtered = filtered.filter(
        (t) => t.category.toLowerCase() === searchCategory
      );
    }

    // Apply amount range filters if provided.
    if (filters?.minAmount !== undefined) {
      filtered = filtered.filter((t) => t.amount >= filters.minAmount!);
    }
    if (filters?.maxAmount !== undefined) {
      filtered = filtered.filter((t) => t.amount <= filters.maxAmount!);
    }

    // Apply date range filters if provided.
    if (filters?.startDate || filters?.endDate) {
      filtered = filtered.filter((t) => {
        const transactionDate = new Date(t.date);
        transactionDate.setHours(0, 0, 0, 0); // Normalize transaction date to start of day.

        let matchesStartDate = true;
        if (filters.startDate) {
          const startFilterDate = new Date(filters.startDate);
          startFilterDate.setHours(0, 0, 0, 0); // Normalize start filter date.
          matchesStartDate = transactionDate >= startFilterDate;
        }

        let matchesEndDate = true;
        if (filters.endDate) {
          const endFilterDate = new Date(filters.endDate);
          endFilterDate.setHours(0, 0, 0, 0); // Normalize end filter date.
          matchesEndDate = transactionDate <= endFilterDate;
        }

        return matchesStartDate && matchesEndDate;
      });
    }

    return { filteredTransactions: filtered };
  }
);