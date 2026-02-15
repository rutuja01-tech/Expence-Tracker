'use server';

import { mockTransactions } from '@/lib/data';
import type { Transaction } from '@/lib/types';
import { revalidatePath } from 'next/cache';

// Mock database interactions
let transactions: Transaction[] = [...mockTransactions];

export async function getTransactions(
  { page = 1, limit = 10 }: { page: number; limit: number }
): Promise<Transaction[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  const start = (page - 1) * limit;
  const end = start + limit;
  return transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(start, end);
}

export async function getAllTransactions(): Promise<Transaction[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}


export async function addTransaction(transactionData: Omit<Transaction, 'id' | 'userId'>) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const newTransaction: Transaction = {
    id: `txn_${Date.now()}`,
    userId: 'user_1', // Mock user
    ...transactionData,
  };
  transactions.unshift(newTransaction);
  revalidatePath('/');
  revalidatePath('/transactions');
  return newTransaction;
}

export async function editTransaction(transactionId: string, transactionData: Partial<Omit<Transaction, 'id' | 'userId'>>) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const index = transactions.findIndex(t => t.id === transactionId);
  if (index !== -1) {
    transactions[index] = { ...transactions[index], ...transactionData };
    revalidatePath('/');
    revalidatePath('/transactions');
    return transactions[index];
  }
  throw new Error('Transaction not found');
}

export async function deleteTransaction(transactionId: string) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const initialLength = transactions.length;
  transactions = transactions.filter(t => t.id !== transactionId);
  if (transactions.length === initialLength) {
    throw new Error('Transaction not found');
  }
  revalidatePath('/');
  revalidatePath('/transactions');
  return { success: true };
}
