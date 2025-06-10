'use client';

import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RotateCcw, Search } from 'lucide-react';
import { LocationSuggester } from './LocationSuggester';

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  yearFilter: string;
  setYearFilter: Dispatch<SetStateAction<string>>;
  locationFilter: string;
  setLocationFilter: Dispatch<SetStateAction<string>>;
  availableYears: string[];
  onResetFilters: () => void;
}

export function Filters({
  searchTerm,
  setSearchTerm,
  yearFilter,
  setYearFilter,
  locationFilter,
  setLocationFilter,
  availableYears,
  onResetFilters,
}: FiltersProps) {
  
  const handleLocationSelected = (location: string) => {
    setLocationFilter(location);
  };

  return (
    <div className="p-4 md:p-6 bg-card rounded-lg shadow-md mb-8 border border-border">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="space-y-1">
          <label htmlFor="keyword-search" className="text-sm font-medium text-foreground">Keyword Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="keyword-search"
              type="text"
              placeholder="Search notes, venue..."
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10"
              aria-label="Keyword search for tour dates"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="year-filter" className="text-sm font-medium text-foreground">Filter by Year</label>
          <Select value={yearFilter} onValueChange={(value) => setYearFilter(value === 'all' ? '' : value)}>
            <SelectTrigger id="year-filter" className="w-full" aria-label="Filter by year">
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Year</SelectLabel>
                <SelectItem value="all">All Years</SelectItem>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label htmlFor="location-suggester" className="text-sm font-medium text-foreground">Filter by Location</label>
          <LocationSuggester 
            onLocationSelect={handleLocationSelected}
            initialValue={locationFilter}
          />
        </div>

        <Button onClick={onResetFilters} variant="outline" className="w-full lg:w-auto">
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
