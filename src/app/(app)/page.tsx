import { SummaryCards } from '@/components/dashboard/summary-cards';
import { CategoryChart } from '@/components/dashboard/category-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { AddTransactionDialog } from '@/components/add-transaction-dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { getAllTransactions } from '@/app/lib/actions';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const transactions = await getAllTransactions();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
          <p className="text-muted-foreground">
            Here&apos;s a summary of your financial activity.
          </p>
        </div>
        <AddTransactionDialog>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </AddTransactionDialog>
      </div>

      <SummaryCards transactions={transactions} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <CategoryChart transactions={transactions} />
        </div>
        <div className="lg:col-span-3">
          <RecentTransactions transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
