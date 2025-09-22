'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { useTrip } from '@/contexts/TripContext';

export default function TripFAB() {
  const { tripCount } = useTrip();

  // Don't show FAB if no items in trip
  if (tripCount === 0) {
    return null;
  }

  return (
    <Link
      href="/itinerary"
      className="fixed bottom-6 right-6 bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full shadow-2xl z-30 transition-all duration-300 transform hover:scale-110 group"
      aria-label="View Trip Itinerary"
    >
      <div className="relative">
        <MapPin className="h-6 w-6" />
        {tripCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {tripCount > 9 ? '9+' : tripCount}
          </span>
        )}
      </div>
    </Link>
  );
}