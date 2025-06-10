
'use client';

import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RotateCcw, Search as SearchIcon } from 'lucide-react'; // Renamed Search to SearchIcon to avoid conflict

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  yearFilter: string;
  setYearFilter: Dispatch<SetStateAction<string>>;
  cityFilter: string;
  setCityFilter: Dispatch<SetStateAction<string>>;
  countryFilter: string;
  setCountryFilter: Dispatch<SetStateAction<string>>;
  availableYears: string[];
  availableCities: string[];
  availableCountries: string[];
  onResetFilters: () => void;
}

export function Filters({
  searchTerm,
  setSearchTerm,
  yearFilter,
  setYearFilter,
  cityFilter,
  setCityFilter,
  countryFilter,
  setCountryFilter,
  availableYears,
  availableCities,
  availableCountries,
  onResetFilters,
}: FiltersProps) {
  
  return (
    <div className="p-4 md:p-6 bg-card rounded-lg shadow-md mb-8 border border-border">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6 mb-6">
        <div className="space-y-1">
          <label htmlFor="keyword-search" className="text-sm font-medium text-foreground">Search</label>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="keyword-search"
              type="text"
              placeholder="Search within notes..."
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10"
              aria-label="Keyword search for tour date notes"
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
          <label htmlFor="city-filter" className="text-sm font-medium text-foreground">Filter by City</label>
          <Select value={cityFilter} onValueChange={(value) => setCityFilter(value === 'all' ? '' : value)}>
            <SelectTrigger id="city-filter" className="w-full" aria-label="Filter by city">
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>City</SelectLabel>
                <SelectItem value="all">All Cities</SelectItem>
                {availableCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label htmlFor="country-filter" className="text-sm font-medium text-foreground">Filter by Country</label>
          <Select value={countryFilter} onValueChange={(value) => setCountryFilter(value === 'all' ? '' : value)}>
            <SelectTrigger id="country-filter" className="w-full" aria-label="Filter by country">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Country</SelectLabel>
                <SelectItem value="all">All Countries</SelectItem>
                {availableCountries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-center sm:justify-end">
        <Button onClick={onResetFilters} variant="outline" className="w-full sm:w-auto">
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
