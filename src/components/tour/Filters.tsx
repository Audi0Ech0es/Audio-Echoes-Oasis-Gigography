
'use client';

import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RotateCcw, Search as SearchIcon } from 'lucide-react';

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
    <div className="relative p-4 bg-card rounded-lg shadow-md mb-8 border border-border">
      <Button
        onClick={onResetFilters}
        variant="ghost"
        size="sm"
        className="absolute top-4 right-4"
        aria-label="Reset all filters"
      >
        <RotateCcw className="mr-1 h-4 w-4" />
        Reset
      </Button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-3 pt-14">
        <div>
          <label htmlFor="keyword-search" className="block text-sm font-medium leading-none text-foreground mb-1.5">Search</label>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="keyword-search"
              type="text"
              placeholder="Keywords..."
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10"
              aria-label="Keyword search for tour date notes"
            />
          </div>
        </div>

        <div>
          <label htmlFor="year-filter" className="block text-sm font-medium leading-none text-foreground mb-1.5">Filter by Year</label>
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

        <div>
          <label htmlFor="city-filter" className="block text-sm font-medium leading-none text-foreground mb-1.5">Filter by City</label>
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

        <div>
          <label htmlFor="country-filter" className="block text-sm font-medium leading-none text-foreground mb-1.5">Filter by Country</label>
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
    </div>
  );
}
