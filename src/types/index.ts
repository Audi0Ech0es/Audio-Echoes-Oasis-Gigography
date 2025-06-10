export interface TourDate {
  id: string;
  date: string; // User-friendly date string from source
  isoDate: string; // ISO 8601 string for reliable sorting and date operations
  venue: string;
  city: string;
  country: string;
  notes?: string;
}
