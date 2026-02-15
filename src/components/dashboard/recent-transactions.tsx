import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import type { Transaction } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

export function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  const recent = transactions.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your last 5 transactions.</CardDescription>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/transactions">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recent.length > 0 ? (
          <div className="space-y-4">
            {recent.map((transaction) => (
              <div key={transaction.id} className="flex items-center">
                <Avatar className="h-9 w-9 border">
                  <AvatarFallback className="bg-transparent">
                    {transaction.amount > 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownLeft className="h-4 w-4 text-red-500" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{transaction.title}</p>
                  <p className="text-sm text-muted-foreground">{transaction.category}</p>
                </div>
                <div
                  className={cn(
                    'ml-auto font-medium',
                    transaction.amount > 0 ? 'text-green-600' : 'text-slate-800'
                  )}
                >
                  {transaction.amount > 0 ? '+' : ''}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            No recent transactions.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
