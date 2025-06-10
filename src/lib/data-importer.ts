
'use server';
import type { TourDate } from '@/types';

// Replace with your actual Google Sheets TSV feed URL when ready.
// Example format: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/gviz/tq?tqx=out:tsv&sheet=SheetName
const GOOGLE_SHEETS_TSV_URL = 'YOUR_GOOGLE_SHEETS_TSV_URL_HERE';

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

    const headers = lines[0].split('\t').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['date', 'venue', 'city', 'country'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

    if (missingHeaders.length > 0) {
      console.error(`Missing required headers in TSV: ${missingHeaders.join(', ')}. Returning empty array.`);
      return [];
    }

    const dateIndex = headers.indexOf('date');
    const venueIndex = headers.indexOf('venue');
    const cityIndex = headers.indexOf('city');
    const countryIndex = headers.indexOf('country');
    const notesIndex = headers.indexOf('notes'); // Optional

    const tourDates: TourDate[] = lines.slice(1).map((line, index) => {
      const values = line.split('\t');
      const dateStr = values[dateIndex]?.trim();
      let parsedDate: Date;
      let isoDateStr: string;

      if (!dateStr) {
        console.warn(`Missing date for row ${index + 2}. Skipping this entry.`);
        return null;
      }
      
      try {
        parsedDate = new Date(dateStr);
        if (isNaN(parsedDate.getTime())) {
          throw new Error(`Invalid date format: "${dateStr}"`);
        }
        // Check if the parsed year is reasonable, e.g., not 1970 for an empty or malformed date string
        if (parsedDate.getFullYear() < 1980 || parsedDate.getFullYear() > new Date().getFullYear() + 20) {
            // Attempt to re-parse with common variations if the initial parse seems off
            // Example: "DD/MM/YYYY" or "MM-DD-YYYY" could be added here
            // For now, we'll stick to new Date() flexibility and the error below.
        }
        if (isNaN(parsedDate.getTime())) { // Double check after any re-parsing attempts
          throw new Error(`Invalid date format after attempts: "${dateStr}"`);
        }

        isoDateStr = parsedDate.toISOString();
      } catch (e) {
        console.warn(`Could not parse date "${dateStr}" for row ${index + 2}: ${(e as Error).message}. Skipping this entry.`);
        return null; 
      }

      return {
        id: String(index + 1), 
        date: parsedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), // Format the date nicely
        isoDate: isoDateStr,
        venue: values[venueIndex]?.trim() || 'N/A',
        city: values[cityIndex]?.trim() || 'N/A',
        country: values[countryIndex]?.trim() || 'N/A',
        notes: notesIndex !== -1 ? (values[notesIndex]?.trim() || '') : '',
      };
    }).filter(Boolean) as TourDate[]; 

    return tourDates.sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime());

  } catch (error) {
    console.error('Error fetching or processing tour data:', error);
    return []; // Fallback to empty array on any error
  }
}
