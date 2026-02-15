import type { Transaction } from '@/lib/types';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TransactionItem } from './transaction-item';

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[250px]">Transaction</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
