
import { fetchTourData } from '@/lib/data-importer';
import { TourTimeline } from '@/components/tour/TourTimeline';

export default async function HomePage() {
  const tourDates = await fetchTourData();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-10 md:mb-16 text-center">
          <div className="inline-flex items-center justify-center bg-primary text-primary-foreground p-4 rounded-full mb-6 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40" fill="currentColor">
              <path d="m368-320 112-84 110 84-42-136 112-88H524l-44-136-44 136H300l110 88-42 136ZM160-160q-33 0-56.5-23.5T80-240v-135q0-11 7-19t18-10q24-8 39.5-29t15.5-47q0-26-15.5-47T105-556q-11-2-18-10t-7-19v-135q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v135q0 11-7 19t-18 10q-24 8-39.5-29T800-480q0 26 15.5 47t39.5 29q11 2 18 10t7 19v135q0 33-23.5 56.5T800-160H160Zm0-80h640v-102q-37-22-58.5-58.5T720-480q0-43 21.5-79.5T800-618v-102H160v102q37 22 58.5 58.5T240-480q0 43-21.5 79.5T160-342v102Zm320-240Z"/>
            </svg>
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
        <p>Part of the There We Were series at <a href="https://audioechoes.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">audioechoes.com</a>.</p>
      </footer>
    </div>
  );
}
