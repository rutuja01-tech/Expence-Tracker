import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import type { Transaction } from '@/lib/types';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SummaryCards({ transactions }: { transactions: Transaction[] }) {
  const totalIncome = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome + totalExpenses;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(netBalance)}</div>
          <p className="text-xs text-muted-foreground">
            Current account balance
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
           <p className="text-xs text-muted-foreground">
            Income received this period
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(Math.abs(totalExpenses))}</div>
           <p className="text-xs text-muted-foreground">
            Expenses paid this period
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
