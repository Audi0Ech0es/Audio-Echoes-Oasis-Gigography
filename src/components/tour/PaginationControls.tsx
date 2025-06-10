'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({ currentPage, totalPages, onPageChange }: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const pageNumbers: (number | string)[] = [];
  const MAX_VISIBLE_PAGES = 5; // Includes current page, first, last, and ellipses

  if (totalPages <= MAX_VISIBLE_PAGES) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    pageNumbers.push(1); // Always show first page

    let rangeStart = Math.max(2, currentPage - 1);
    let rangeEnd = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) { // Near the start
      rangeStart = 2;
      rangeEnd = Math.min(totalPages - 1, MAX_VISIBLE_PAGES - 2); // -2 for first and last page
    } else if (currentPage >= totalPages - 2) { // Near the end
      rangeStart = Math.max(2, totalPages - (MAX_VISIBLE_PAGES - 3)); // -3 for first, last and one ellipsis
      rangeEnd = totalPages - 1;
    }
    
    if (rangeStart > 2) {
      pageNumbers.push('...');
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pageNumbers.push(i);
    }

    if (rangeEnd < totalPages - 1) {
      pageNumbers.push('...');
    }
    
    pageNumbers.push(totalPages); // Always show last page
  }
  
  // Deduplicate and ensure ellipsis logic is clean
  const finalPageNumbers = pageNumbers.reduce((acc, current) => {
    if (typeof current === 'string' && typeof acc[acc.length - 1] === 'string') {
      // Don't add consecutive ellipsis
    } else if (typeof current === 'number' && current === 1 && acc.includes(1) && acc.indexOf(1) !== 0) {
      // Avoid duplicate 1 unless it's the first item
    } else if (typeof current === 'number' && current === totalPages && acc.includes(totalPages) && acc.indexOf(totalPages) !== acc.length -1) {
       // Avoid duplicate last page unless it's the last item
    }
    else {
      acc.push(current);
    }
    return acc;
  }, [] as (number | string)[]);


  return (
    <div className="flex items-center justify-center space-x-1 sm:space-x-2 mt-8 mb-4" role="navigation" aria-label="Pagination">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handlePrev} 
        disabled={currentPage === 1} 
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      {finalPageNumbers.map((num, index) => (
        typeof num === 'number' ? (
          <Button
            key={`page-${num}-${index}`}
            variant={currentPage === num ? 'default' : 'outline'}
            onClick={() => onPageChange(num)}
            className="w-9 h-9 sm:w-10 sm:h-10 text-sm"
            aria-label={`Go to page ${num}`}
            aria-current={currentPage === num ? 'page' : undefined}
          >
            {num}
          </Button>
        ) : (
          <span key={`ellipsis-${index}`} className="px-1 sm:px-2 text-muted-foreground self-end" aria-hidden="true">...</span>
        )
      ))}

      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleNext} 
        disabled={currentPage === totalPages} 
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
