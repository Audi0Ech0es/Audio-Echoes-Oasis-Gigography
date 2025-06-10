
import { fetchTourData } from '@/lib/data-importer';
import { TourTimeline } from '@/components/tour/TourTimeline';

export default async function HomePage() {
  const tourDates = await fetchTourData();
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-10 md:mb-16 text-center">
          
          
          
        </header>
        
        <TourTimeline initialTourDates={tourDates} />

      </main>
      <footer className="mt-12 py-8 border-t border-border text-center text-muted-foreground text-sm">
        <p>Part of the There We Were series at <a href="https://audioechoes.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">audioechoes.com</a>.</p>
      </footer>
    </div>
  );
}
