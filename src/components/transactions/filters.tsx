'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { useState } from 'react';

type FiltersProps = {
  onAiSearch: (query: string) => void;
  isSearching: boolean;
};

export function Filters({ onAiSearch, isSearching }: FiltersProps) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onAiSearch(query);
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="AI Search: e.g., 'dining out last month', 'groceries over $50'..."
          className="w-full pl-8"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSearching}
        />
      </div>
      <Button onClick={handleSearch} disabled={isSearching || !query}>
        {isSearching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Search
      </Button>
    </div>
  );
}
