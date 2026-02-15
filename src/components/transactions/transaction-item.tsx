'use client';

import { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import type { Transaction } from '@/lib/types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { AddTransactionDialog } from '../add-transaction-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { deleteTransaction } from '@/app/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function TransactionItem({ transaction }: { transaction: Transaction }) {
  const { toast } = useToast();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteTransaction(transaction.id);
      toast({
        title: "Success",
        description: "Transaction deleted.",
      });
      setIsDeleteOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Failed to delete transaction.",
      });
    }
  };

  return (
    <>
      <AddTransactionDialog transactionToEdit={transaction} open={isEditOpen} onOpenChange={setIsEditOpen} />
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <TableRow>
        <TableCell>
          <div className="font-medium">{transaction.title}</div>
          {transaction.notes && (
            <div className="hidden text-sm text-muted-foreground md:inline">
              {transaction.notes}
            </div>
          )}
        </TableCell>
        <TableCell>
          <Badge variant="outline">{transaction.category}</Badge>
        </TableCell>
        <TableCell>{format(new Date(transaction.date), 'MMM d, yyyy')}</TableCell>
        <TableCell className={cn("text-right", transaction.amount < 0 ? 'text-slate-800' : 'text-green-600')}>
          {formatCurrency(transaction.amount)}
        </TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setIsEditOpen(true)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setIsDeleteOpen(true)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    </>
  );
}
