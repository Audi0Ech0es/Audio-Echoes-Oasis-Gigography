
import type { TourDate } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, MapPin, Mic2 } from 'lucide-react';
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
          <CalendarDays className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
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
