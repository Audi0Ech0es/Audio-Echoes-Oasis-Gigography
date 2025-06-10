
'use client';

import type { TourDate } from '@/types';
import React, { useState, useMemo, useEffect } from 'react';
import { TourDateCard } from './TourDateCard';
import { Filters } from './Filters';
import { PaginationControls } from './PaginationControls';
import { Loader2, TicketSlash } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const ITEMS_PER_PAGE = 9; // Adjusted for 3-column layout

interface TourTimelineProps {
  initialTourDates: TourDate[];
}

export function TourTimeline({ initialTourDates }: TourTimelineProps) {
  const [allTourDates] = useState<TourDate[]>(initialTourDates); // Initial data is server-rendered
  const [isLoading] = useState(false); // Placeholder if client-side fetching is added later
  
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const availableYears = useMemo(() => {
    const years = new Set(
      allTourDates.map(date => {
        try {
          return new Date(date.isoDate).getFullYear().toString();
        } catch (e) { return null; }
      }).filter(Boolean) as string[]
    );
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
  }, [allTourDates]);

  const availableLocations = useMemo(() => {
    const locations = new Set<string>();
    allTourDates.forEach(date => {
      if (date.city) locations.add(date.city);
      if (date.country) locations.add(date.country);
      if (date.venue) locations.add(date.venue);
    });
    return Array.from(locations).sort((a, b) => a.localeCompare(b));
  }, [allTourDates]);

  const filteredTourDates = useMemo(() => {
    return allTourDates
      .filter(date => {
        let dateObj;
        try {
          dateObj = new Date(date.isoDate);
          if (isNaN(dateObj.getTime())) throw new Error('Invalid date');
        } catch(e) {
          return false; // Skip entries with unparseable dates
        }
        
        const yearMatches = yearFilter ? dateObj.getFullYear().toString() === yearFilter : true;
        
        const locationString = `${date.city} ${date.country} ${date.venue}`.toLowerCase();
        const locationMatches = locationFilter ? locationString.includes(locationFilter.toLowerCase()) : true;
        
        // Keyword search now only targets notes
        const searchString = `${date.notes || ''}`.toLowerCase();
        const searchMatches = searchTerm ? searchString.includes(searchTerm.toLowerCase()) : true;
        
        return yearMatches && locationMatches && searchMatches;
      });
  }, [allTourDates, searchTerm, yearFilter, locationFilter]);

  const totalPages = Math.ceil(filteredTourDates.length / ITEMS_PER_PAGE);
  const paginatedTourDates = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTourDates.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTourDates, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, yearFilter, locationFilter]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setYearFilter('');
    setLocationFilter('');
    // setCurrentPage(1); // Already handled by useEffect above
  };

  if (isLoading && !allTourDates.length) { // Initial loading state (if data were client-fetched)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-semibold">Loading tour dates...</p>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <Filters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        yearFilter={yearFilter}
        setYearFilter={setYearFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        availableYears={availableYears}
        availableLocations={availableLocations}
        onResetFilters={handleResetFilters}
      />

      {filteredTourDates.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[250px] text-center py-10 bg-card rounded-lg shadow border border-border">
           <TicketSlash className="h-16 w-16 text-primary mb-4" />
          <h3 className="text-2xl font-headline font-semibold text-foreground mb-2">No Tour Dates Found</h3>
          <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms.</p>
           <Button onClick={handleResetFilters} variant="outline">
             Reset All Filters
           </Button>
        </div>
      ) : (
        <>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            layout // Apply layout animation to the container of cards
          >
            <AnimatePresence mode="popLayout">
              {paginatedTourDates.map((tourDate) => (
                <motion.div
                  key={tourDate.id}
                  layout // Enables smooth reordering/filtering animations for each card
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <TourDateCard tourDate={tourDate} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
