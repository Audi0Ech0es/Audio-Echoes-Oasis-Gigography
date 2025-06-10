
import type { TourDate } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Mic2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface TourDateCardProps {
  tourDate: TourDate;
}

export function TourDateCard({ tourDate }: TourDateCardProps) {
  let displayDate = tourDate.date; // Fallback to original date string
  try {
    if (tourDate.isoDate) {
      displayDate = format(parseISO(tourDate.isoDate), 'MMMM d, yyyy');
    }
  } catch (error) {
    console.warn(`Could not format date ${tourDate.isoDate}: `, error);
  }

  return (
    <Card className="w-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-xl font-headline">
          <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor" className="mr-2 h-5 w-5 text-primary flex-shrink-0">
            <path d="M580-240q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/>
          </svg>
          {displayDate}
        </CardTitle>
        <CardDescription className="flex items-center text-sm pt-1">
          <MapPin className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
          {tourDate.city}, {tourDate.country}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center mb-2">
          <Mic2 className="mr-2 h-5 w-5 text-accent flex-shrink-0" />
          <p className="text-md font-semibold">{tourDate.venue}</p>
        </div>
        {tourDate.notes && (
          <p className="text-sm text-muted-foreground italic line-clamp-3">
            {tourDate.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
