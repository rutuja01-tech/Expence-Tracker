'use client';
import { useState, useEffect, useCallback, useTransition, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Transaction } from '@/lib/types';
import { getTransactions, getAllTransactions } from '@/app/lib/actions';
import { searchTransactions } from '@/ai/flows/ai-powered-transaction-search';
import { TransactionList } from '@/components/transactions/transaction-list';
import { Filters } from '@/components/transactions/filters';
import { AddTransactionDialog } from '@/components/add-transaction-dialog';
import { PlusCircle, Loader2 } from 'lucide-react';

const PAGE_SIZE = 15;

export default function TransactionsPage() {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [displayedTransactions, setDisplayedTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiSearching, startAiSearch] = useTransition();
  const [isSearchActive, setIsSearchActive] = useState(false);

  const loadInitialTransactions = useCallback(async () => {
    setIsLoading(true);
    const initialTxs = await getAllTransactions();
    setAllTransactions(initialTxs);
    setDisplayedTransactions(initialTxs.slice(0, PAGE_SIZE));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadInitialTransactions();
  }, [loadInitialTransactions]);

  const loadMoreTransactions = () => {
    if (isLoading) return;
    setIsLoading(true);
    const nextPage = page + 1;
    const newTxs = allTransactions.slice(0, nextPage * PAGE_SIZE);
    setDisplayedTransactions(newTxs);
    setPage(nextPage);
    setIsLoading(false);
  };

  const hasMore = useMemo(() => {
    return !isSearchActive && displayedTransactions.length < allTransactions.length;
  }, [displayedTransactions, allTransactions, isSearchActive]);

  const handleAiSearch = (query: string) => {
    startAiSearch(async () => {
      if (!query) {
        setDisplayedTransactions(allTransactions.slice(0, PAGE_SIZE));
        setIsSearchActive(false);
        setPage(1);
        return;
      }
      setIsSearchActive(true);
      const result = await searchTransactions({ query, transactions: allTransactions });
      setDisplayedTransactions(result.filteredTransactions);
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle className="font-headline">Transactions</CardTitle>
            <CardDescription>
              Browse, search, and manage your transaction history.
            </CardDescription>
          </div>
          <AddTransactionDialog>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </AddTransactionDialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Filters onAiSearch={handleAiSearch} isSearching={isAiSearching} />
        {isLoading && allTransactions.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TransactionList transactions={displayedTransactions} />
            {displayedTransactions.length === 0 && (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No transactions found.</p>
              </div>
            )}
            {hasMore && (
              <div className="text-center">
                <Button onClick={loadMoreTransactions} variant="outline" disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
