'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

export function TourSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('keyword') || '경복궁');
  
  // URL에서 keyword 읽기
  useEffect(() => {
    const keyword = searchParams.get('keyword') || '';
    setSearchTerm(keyword);
  }, [searchParams]);
  
  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    const params = new URLSearchParams(searchParams.toString());
    params.set('keyword', searchTerm.trim());
    router.push(`/?${params.toString()}`);
  };
  
  const handleClear = () => {
    setSearchTerm('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('keyword');
    router.push(`/?${params.toString()}`);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyPress}
        className="pr-20"
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-12 top-1/2 -translate-y-1/2 h-8"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <Button
        onClick={handleSearch}
        className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
        size="sm"
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}
