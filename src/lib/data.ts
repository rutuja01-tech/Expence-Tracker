import type { Transaction } from '@/lib/types';

export const mockTransactions: Transaction[] = [
  {
    id: "txn_1",
    userId: "user_1",
    title: "Grocery Shopping at FreshMart",
    amount: -75.50,
    category: "Groceries",
    date: "2024-07-28T10:00:00Z",
    notes: "Weekly groceries"
  },
  {
    id: "txn_2",
    userId: "user_1",
    title: "Monthly Salary",
    amount: 3500.00,
    category: "Income",
    date: "2024-07-25T09:00:00Z",
    notes: "July Salary"
  },
  {
    id: "txn_3",
    userId: "user_1",
    title: "Dinner at The Italian Place",
    amount: -55.00,
    category: "Dining Out",
    date: "2024-07-26T19:30:00Z",
  },
  {
    id: "txn_4",
    userId: "user_1",
    title: "Netflix Subscription",
    amount: -15.99,
    category: "Subscriptions",
    date: "2024-07-20T12:00:00Z",
    notes: "Monthly plan"
  },
  {
    id: "txn_5",
    userId: "user_1",
    title: "Train ticket to City Center",
    amount: -5.50,
    category: "Transport",
    date: "2024-07-22T08:15:00Z",
  },
  {
    id: "txn_6",
    userId: "user_1",
    title: "New T-shirt from StyleCo",
    amount: -29.99,
    category: "Shopping",
    date: "2024-07-21T15:45:00Z",
  },
  {
    id: "txn_7",
    userId: "user_1",
    title: "Electricity Bill",
    amount: -65.20,
    category: "Bills",
    date: "2024-07-18T11:00:00Z",
    notes: "For June"
  },
  {
    id: "txn_8",
    userId: "user_1",
    title: "Coffee with a friend",
    amount: -8.75,
    category: "Food",
    date: "2024-07-27T14:00:00Z",
  },
  {
    id: "txn_9",
    userId: "user_1",
    title: "Freelance Project Payment",
    amount: 500.00,
    category: "Income",
    date: "2024-07-15T18:00:00Z",
  },
  {
    id: "txn_10",
    userId: "user_1",
    title: "Cinema Tickets: 'The Last Stand'",
    amount: -25.00,
    category: "Entertainment",
    date: "2024-07-19T20:00:00Z",
  },
];
