import { fetchTourData } from '@/lib/data-importer';
import { TourTimeline } from '@/components/tour/TourTimeline';

export default async function HomePage() {
  const tourDates = await fetchTourData();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-10 md:mb-16 text-center">
          <div className="inline-flex items-center justify-center bg-primary text-primary-foreground p-4 rounded-full mb-6 shadow-lg">
            {/* Simple Music/Map Icon Combination */}
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"/>
              <path d="m9 9 12-2"/>
              <circle cx="6" cy="18" r="3"/>
              <circle cx="18" cy="16" r="3"/>
              <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" fill="hsla(var(--accent)/0.5)" stroke="hsl(var(--accent-foreground))" />
              <circle cx="12" cy="10" r="3" fill="hsl(var(--accent-foreground))" stroke="hsl(var(--accent))"/>
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold text-foreground tracking-tight">
            Tour<span className="text-primary">Mapper</span>
          </h1>
          <p className="mt-4 text-md sm:text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore tour dates, filter by location and year, and discover your next concert adventure with AI-powered suggestions.
          </p>
        </header>
        
        <TourTimeline initialTourDates={tourDates} />

      </main>
      <footer className="mt-12 py-8 border-t border-border text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Tour Mapper. All rights reserved.</p>
        <p className="mt-1">Find your rhythm on the road.</p>
      </footer>
    </div>
  );
}
