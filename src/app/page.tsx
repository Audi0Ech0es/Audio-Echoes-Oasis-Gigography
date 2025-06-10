
import { fetchTourData } from '@/lib/data-importer';
import { TourTimeline } from '@/components/tour/TourTimeline';
import { CassetteTape } from 'lucide-react';

export default async function HomePage() {
  const tourDates = await fetchTourData();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-10 md:mb-16 text-center">
          <div className="inline-flex items-center justify-center bg-primary text-primary-foreground p-4 rounded-full mb-6 shadow-lg">
            <CassetteTape size={40} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold text-foreground tracking-tight">
            Oasis<span className="text-primary">Gigography</span>
          </h1>
          <p className="mt-4 text-md sm:text-lg text-muted-foreground max-w-3xl mx-auto">
            Your ultimate guide to every Oasis gig. Relive the madness, find your night.
          </p>
        </header>
        
        <TourTimeline initialTourDates={tourDates} />

      </main>
      <footer className="mt-12 py-8 border-t border-border text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Oasis Gigography. Part of the <a href="https://audioechoes.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">There We Were</a> series at audioechoes.com.</p>
      </footer>
    </div>
  );
}
