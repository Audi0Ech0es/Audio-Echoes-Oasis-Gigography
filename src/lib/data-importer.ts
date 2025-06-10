
'use server';
import type { TourDate } from '@/types';

// Replace with your actual Google Sheets TSV feed URL when ready.
// Example format: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/gviz/tq?tqx=out:tsv&sheet=SheetName
const GOOGLE_SHEETS_TSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQFiiNQbh6Zl6XboxeYDkXlgY0lCVxbgKY13disqsct61g_WmLXSnTG3HUeuzihqZ-HR0N6TIhPWyXb/pub?output=tsv';

export async function fetchTourData(): Promise<TourDate[]> {
  let tsvData: string;

  if (GOOGLE_SHEETS_TSV_URL === 'YOUR_GOOGLE_SHEETS_TSV_URL_HERE') {
    console.warn(
      'Google Sheets URL is not configured. Please update GOOGLE_SHEETS_TSV_URL in src/lib/data-importer.ts. Returning empty array.'
    );
    return [];
  }

  try {
    const response = await fetch(GOOGLE_SHEETS_TSV_URL, { cache: 'no-store' });
    if (!response.ok) {
      console.error(
        `Failed to fetch tour data from Google Sheets: ${response.status} ${response.statusText}. Returning empty array.`
      );
      return [];
    }
    tsvData = await response.text();

    if (!tsvData || tsvData.trim() === '') {
      console.warn('Fetched TSV data is empty. Returning empty array.');
      return [];
    }

    const lines = tsvData.trim().split('\n');
    if (lines.length < 2) {
      console.warn('No data rows found in TSV (only headers or empty). Returning empty array.');
      return [];
    }

    const headers = lines[0].split('\t').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    const requiredHeaders = ['date', 'venue', 'city', 'country'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

    if (missingHeaders.length > 0) {
      console.error(`Missing required headers in TSV: ${missingHeaders.join(', ')}. Headers found: ${headers.join(', ')}. Returning empty array.`);
      return [];
    }

    const dateIndex = headers.indexOf('date');
    const venueIndex = headers.indexOf('venue');
    const cityIndex = headers.indexOf('city');
    const countryIndex = headers.indexOf('country');
    const notesIndex = headers.indexOf('notes'); // Optional

    const tourDates: TourDate[] = lines.slice(1).map((line, index) => {
      const values = line.split('\t').map(v => v.trim().replace(/"/g, ''));
      
      const dateStr = values[dateIndex];
      let parsedDate: Date;
      let isoDateStr: string;

      if (!dateStr) {
        console.warn(`Missing date for row ${index + 2}. Skipping this entry.`);
        return null;
      }
      
      try {
        // Attempt to parse common date formats, including DD/MM/YYYY and MM/DD/YYYY
        // Standard new Date() in JS often prefers MM/DD/YYYY, but can be ambiguous
        let day: number, month: number, year: number;
        
        if (dateStr.includes('/')) {
            const parts = dateStr.split('/');
            if (parts.length === 3) {
                // Check if it's likely DD/MM/YYYY (if first part > 12)
                const firstPart = parseInt(parts[0], 10);
                const secondPart = parseInt(parts[1], 10);
                if (firstPart > 12 && secondPart <= 12) { // Likely DD/MM/YYYY
                    day = firstPart;
                    month = secondPart;
                    year = parseInt(parts[2], 10);
                } else { // Assume MM/DD/YYYY or ambiguous, let new Date() try
                    parsedDate = new Date(dateStr);
                    if (isNaN(parsedDate.getTime())) throw new Error('Invalid date');
                    isoDateStr = parsedDate.toISOString();
                    // Fall through to use parsedDate directly
                }
            } else {
                 parsedDate = new Date(dateStr); // Try direct parsing
                 if (isNaN(parsedDate.getTime())) throw new Error('Invalid date');
                 isoDateStr = parsedDate.toISOString();
            }
            if (typeof day !== 'undefined' && typeof month !== 'undefined' && typeof year !== 'undefined') {
                 // Adjust year if it's two digits (e.g., 24 -> 2024)
                 if (year < 100) {
                    year += (year > 50 ? 1900 : 2000); // Heuristic for 2-digit years
                 }
                parsedDate = new Date(year, month - 1, day); // Month is 0-indexed
                if (isNaN(parsedDate.getTime())) throw new Error('Invalid date');
                isoDateStr = parsedDate.toISOString();
            }

        } else {
            parsedDate = new Date(dateStr); // For formats like YYYY-MM-DD or Month D, YYYY
             if (isNaN(parsedDate.getTime())) throw new Error('Invalid date');
            isoDateStr = parsedDate.toISOString();
        }
        
        if (isNaN(parsedDate.getTime())) {
          throw new Error(`Invalid date format: "${dateStr}"`);
        }
        
        isoDateStr = parsedDate.toISOString();

      } catch (e) {
        console.warn(`Could not parse date "${dateStr}" for row ${index + 2}: ${(e as Error).message}. Skipping this entry.`);
        return null; 
      }

      return {
        id: String(index + 1), 
        date: parsedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        isoDate: isoDateStr,
        venue: values[venueIndex] || 'N/A',
        city: values[cityIndex] || 'N/A',
        country: values[countryIndex] || 'N/A',
        notes: notesIndex !== -1 ? (values[notesIndex] || '') : '',
      };
    }).filter(Boolean) as TourDate[]; 

    return tourDates.sort((a, b) => new Date(a.isoDate).getTime() - new Date(b.isoDate).getTime()); // Sort chronologically

  } catch (error) {
    console.error('Error fetching or processing tour data:', error);
    return []; 
  }
}

