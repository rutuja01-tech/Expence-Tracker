export interface Transaction {
  id: string;
  userId: string;
  title: string;
  amount: number;
  category: string;
  date: string; // ISO string format
  notes?: string;
}

export type TransactionCategory =
  | 'Food'
  | 'Transport'
  | 'Utilities'
  | 'Entertainment'
  | 'Shopping'
  | 'Rent'
  | 'Salary'
  | 'Healthcare'
  | 'Education'
  | 'Groceries'
  | 'Dining Out'
  | 'Travel'
  | 'Bills'
  | 'Income'
  | 'Savings'
  | 'Investments'
  | 'Gifts'
  | 'Personal Care'
  | 'Technology'
  | 'Home Improvement'
  | 'Subscriptions'
  | 'Other';

export const transactionCategories: string[] = [
  'Food',
  'Transport',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Rent',
  'Salary',
  'Healthcare',
  'Education',
  'Groceries',
  'Dining Out',
  'Travel',
  'Bills',
  'Income',
  'Savings',
  'Investments',
  'Gifts',
  'Personal Care',
  'Technology',
  'Home Improvement',
  'Subscriptions',
  'Other',
];
