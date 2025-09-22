'use client';

import { ReactNode } from 'react';
import { TripProvider } from '@/contexts/TripContext';
import TripFAB from '@/components/TripFAB';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <TripProvider>
      {children}
      <TripFAB />
    </TripProvider>
  );
}


