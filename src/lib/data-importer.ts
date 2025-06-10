'use server';
import type { TourDate } from '@/types';

// Replace with your actual Google Sheets TSV feed URL when ready.
// Example format: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/gviz/tq?tqx=out:tsv&sheet=SheetName
const GOOGLE_SHEETS_TSV_URL = 'YOUR_GOOGLE_SHEETS_TSV_URL_HERE';

const sampleTourData: TourDate[] = [
  { id: '1', date: 'Aug 15, 2024', isoDate: new Date('2024-08-15T00:00:00.000Z').toISOString(), venue: 'Hollywood Bowl', city: 'Los Angeles', country: 'USA', notes: 'Opening night of the grand tour!' },
  { id: '2', date: 'Aug 20, 2024', isoDate: new Date('2024-08-20T00:00:00.000Z').toISOString(), venue: 'Wembley Stadium', city: 'London', country: 'UK', notes: 'Special guest appearance by a legend.' },
  { id: '3', date: 'Jul 10, 2023', isoDate: new Date('2023-07-10T00:00:00.000Z').toISOString(), venue: 'Accor Arena', city: 'Paris', country: 'France', notes: 'Sold out show, unforgettable night.' },
  { id: '4', date: 'Sep 05, 2023', isoDate: new Date('2023-09-05T00:00:00.000Z').toISOString(), venue: 'Mercedes-Benz Arena', city: 'Berlin', country: 'Germany', notes: 'Energetic crowd, amazing acoustics.' },
  { id: '5', date: 'Oct 01, 2024', isoDate: new Date('2024-10-01T00:00:00.000Z').toISOString(), venue: 'Tokyo Dome', city: 'Tokyo', country: 'Japan', notes: 'Closing show of the Asian leg.' },
  { id: '6', date: 'Jan 25, 2024', isoDate: new Date('2024-01-25T00:00:00.000Z').toISOString(), venue: 'Madison Square Garden', city: 'New York', country: 'USA', notes: 'Album release concert, played new songs.' },
  { id: '7', date: 'Nov 12, 2023', isoDate: new Date('2023-11-12T00:00:00.000Z').toISOString(), venue: 'The O2', city: 'London', country: 'UK', notes: 'Intimate acoustic set.' },
  { id: '8', date: 'Mar 18, 2024', isoDate: new Date('2024-03-18T00:00:00.000Z').toISOString(), venue: 'Crypto.com Arena', city: 'Los Angeles', country: 'USA', notes: 'Charity event performance.' },
  { id: '9', date: 'May 02, 2023', isoDate: new Date('2023-05-02T00:00:00.000Z').toISOString(), venue: 'Rod Laver Arena', city: 'Melbourne', country: 'Australia', notes: 'First time performing in Australia!' },
  { id: '10', date: 'Jun 30, 2024', isoDate: new Date('2024-06-30T00:00:00.000Z').toISOString(), venue: 'Bell Centre', city: 'Montreal', country: 'Canada', notes: 'Joined by a popular local band for a song.' },
  { id: '11', date: 'Aug 08, 2023', isoDate: new Date('2023-08-08T00:00:00.000Z').toISOString(), venue: 'Ziggo Dome', city: 'Amsterdam', country: 'Netherlands', notes: 'Festival headliner, massive stage.' },
  { id: '12', date: 'Sep 15, 2024', isoDate: new Date('2024-09-15T00:00:00.000Z').toISOString(), venue: 'Palau Sant Jordi', city: 'Barcelona', country: 'Spain', notes: 'The crowd sang along to every song.' },
  { id: '13', date: 'Dec 01, 2023', isoDate: new Date('2023-12-01T00:00:00.000Z').toISOString(), venue: 'Avicii Arena', city: 'Stockholm', country: 'Sweden', notes: 'Winter tour special with festive lights.' },
  { id: '14', date: 'Feb 20, 2024', isoDate: new Date('2024-02-20T00:00:00.000Z').toISOString(), venue: 'Espaço Unimed', city: 'São Paulo', country: 'Brazil', notes: 'South American debut, incredible energy.' },
  { id: '15', date: 'Oct 25, 2023', isoDate: new Date('2023-10-25T00:00:00.000Z').toISOString(), venue: 'Foro Sol', city: 'Mexico City', country: 'Mexico', notes: 'Largest venue of the tour, over 60,000 people.' },
];

export async function fetchTourData(): Promise<TourDate[]> {
  // Using a hardcoded TSV string for demonstration.
  // Replace this with actual fetch from GOOGLE_SHEETS_TSV_URL in a real application.
  const tsvData = `Date\tVenue\tCity\tCountry\tNotes
2024-08-15\tHollywood Bowl\tLos Angeles\tUSA\tOpening night of the grand tour!
2024-08-20\tWembley Stadium\tLondon\tUK\tSpecial guest appearance by a legend.
2023-07-10\tAccor Arena\tParis\tFrance\tSold out show, unforgettable night.
2023-09-05\tMercedes-Benz Arena\tBerlin\tGermany\tEnergetic crowd, amazing acoustics.
2024-10-01\tTokyo Dome\tTokyo\tJapan\tClosing show of the Asian leg.
2024-01-25\tMadison Square Garden\tNew York\tUSA\tAlbum release concert, played new songs.
2023-11-12\tThe O2\tLondon\tUK\tIntimate acoustic set.
2024-03-18\tCrypto.com Arena\tLos Angeles\tUSA\tCharity event performance.
2023-05-02\tRod Laver Arena\tMelbourne\tAustralia\tFirst time performing in Australia!
2024-06-30\tBell Centre\tMontreal\tCanada\tJoined by a popular local band for a song.
2023-08-08\tZiggo Dome\tAmsterdam\tNetherlands\tFestival headliner, massive stage.
2024-09-15\tPalau Sant Jordi\tBarcelona\tSpain\tThe crowd sang along to every song.
2023-12-01\tAvicii Arena\tStockholm\tSweden\tWinter tour special with festive lights.
2024-02-20\tEspaço Unimed\tSão Paulo\tBrazil\tSouth American debut, incredible energy.
2023-10-25\tForo Sol\tMexico City\tMexico\tLargest venue of the tour, over 60,000 people.
Invalid Date Line\tTest Venue\tTest City\tTest Country\tTest Note for invalid date
2023-04-31\tInvalid Day Venue\tTest City\tTest Country\tTest Note for invalid day in date
`;

  try {
    // In a real scenario, you would uncomment and use this:
    // if (GOOGLE_SHEETS_TSV_URL === 'YOUR_GOOGLE_SHEETS_TSV_URL_HERE') {
    //   console.warn("Using sample data. Please configure GOOGLE_SHEETS_TSV_URL in data-importer.ts");
    // } else {
    //   const response = await fetch(GOOGLE_SHEETS_TSV_URL, { cache: 'no-store' });
    //   if (!response.ok) {
    //     console.error('Failed to fetch tour data from Google Sheets:', response.statusText);
    //     return sampleTourData; // Fallback to sample data
    //   }
    //   tsvData = await response.text();
    // }

    const lines = tsvData.trim().split('\n');
    if (lines.length < 2) {
      console.warn('No data or only headers found in TSV. Returning sample data.');
      return sampleTourData.sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime());
    }

    const headers = lines[0].split('\t').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['date', 'venue', 'city', 'country'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

    if (missingHeaders.length > 0) {
      console.error(`Missing required headers in TSV: ${missingHeaders.join(', ')}. Returning sample data.`);
      return sampleTourData.sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime());
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

      try {
        // Attempt to parse common date formats or rely on Date constructor flexibility
        parsedDate = new Date(dateStr);
        if (isNaN(parsedDate.getTime())) {
          // Handle specific formats if needed, e.g., "MMM DD, YYYY"
          // For now, throw error if standard parsing fails.
          throw new Error(`Invalid date format: "${dateStr}"`);
        }
        isoDateStr = parsedDate.toISOString();
      } catch (e) {
        console.warn(`Could not parse date "${dateStr}" for row ${index + 2}. Skipping this entry.`);
        return null; // Skip invalid entries
      }

      return {
        id: String(index + 1), // Simple ID based on row index
        date: dateStr || 'N/A',
        isoDate: isoDateStr,
        venue: values[venueIndex]?.trim() || 'N/A',
        city: values[cityIndex]?.trim() || 'N/A',
        country: values[countryIndex]?.trim() || 'N/A',
        notes: notesIndex !== -1 ? (values[notesIndex]?.trim() || '') : '',
      };
    }).filter(Boolean) as TourDate[]; // Filter out null entries

    // Sort by date descending (most recent first)
    return tourDates.sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime());

  } catch (error) {
    console.error('Error processing tour data:', error);
    // Fallback to sample data on any processing error
    return sampleTourData.sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime());
  }
}
