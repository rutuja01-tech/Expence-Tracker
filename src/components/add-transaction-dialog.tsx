'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { CalendarIcon, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { transactionCategories, Transaction } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { addTransaction, editTransaction } from '@/app/lib/actions';
import { suggestTransactionCategories } from '@/ai/flows/suggest-transaction-categories';

const formSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  amount: z.coerce.number().refine(val => val !== 0, { message: 'Amount cannot be zero.' }),
  category: z.string().min(1, { message: 'Please select a category.' }),
  date: z.date({ required_error: 'A date is required.' }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type AddTransactionDialogProps = {
  children?: ReactNode;
  transactionToEdit?: Transaction;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function AddTransactionDialog({ children, transactionToEdit, open: controlledOpen, onOpenChange: setControlledOpen }: AddTransactionDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = setControlledOpen ?? setInternalOpen;
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      amount: 0,
      category: '',
      date: new Date(),
      notes: '',
    },
  });

  useEffect(() => {
    if (transactionToEdit && open) {
      form.reset({
        title: transactionToEdit.title,
        amount: transactionToEdit.amount,
        category: transactionToEdit.category,
        date: new Date(transactionToEdit.date),
        notes: transactionToEdit.notes || '',
      });
    } else if (!open) {
      form.reset();
      setSuggestedCategories([]);
    }
  }, [transactionToEdit, open, form]);

  const handleSuggestCategories = async () => {
    const title = form.getValues('title');
    const notes = form.getValues('notes');
    if (!title) {
      toast({ variant: 'destructive', title: 'Please enter a title first.' });
      return;
    }
    setIsSuggesting(true);
    try {
      const result = await suggestTransactionCategories({ title, notes });
      setSuggestedCategories(result.suggestedCategories);
    } catch (error) {
      toast({ variant: 'destructive', title: 'AI Suggestion Failed' });
    }
    setIsSuggesting(false);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    try {
      const transactionData = {
        ...data,
        date: data.date.toISOString(),
      };
      if (transactionToEdit) {
        await editTransaction(transactionToEdit.id, transactionData);
        toast({ title: 'Success', description: 'Transaction updated.' });
      } else {
        await addTransaction(transactionData);
        toast({ title: 'Success', description: 'Transaction added.' });
      }
      setOpen(false);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save transaction.' });
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{transactionToEdit ? 'Edit' : 'Add'} Transaction</DialogTitle>
          <DialogDescription>
            {transactionToEdit ? 'Update the details of your transaction.' : 'Enter the details of your new transaction.'}
          </DialogDescription>
        </DialogHeader>
        <form id="transaction-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register('title')} />
            {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" step="0.01" {...form.register('amount')} />
            <p className="text-xs text-muted-foreground">Use negative for expenses, positive for income.</p>
            {form.formState.errors.amount && <p className="text-sm text-destructive">{form.formState.errors.amount.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <div className="flex items-center gap-2">
              <Select onValueChange={(value) => form.setValue('category', value)} value={form.watch('category')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {transactionCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button type="button" variant="outline" size="icon" onClick={handleSuggestCategories} disabled={isSuggesting}>
                <Sparkles className={cn("h-4 w-4", isSuggesting && "animate-spin")} />
              </Button>
            </div>
            {suggestedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {suggestedCategories.map(cat => (
                  <Button key={cat} type="button" variant="outline" size="sm" onClick={() => form.setValue('category', cat, { shouldValidate: true })}>
                    {cat}
                  </Button>
                ))}
              </div>
            )}
            {form.formState.errors.category && <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !form.watch('date') && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.watch('date') ? format(form.watch('date'), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={form.watch('date')}
                  onSelect={(date) => date && form.setValue('date', date, { shouldValidate: true })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {form.formState.errors.date && <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea id="notes" {...form.register('notes')} />
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="transaction-form" disabled={isSaving} className="bg-accent hover:bg-accent/90">
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? 'Saving...' : 'Save Transaction'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
