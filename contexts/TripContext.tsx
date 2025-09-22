'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TripContextType {
  tripLocationIds: number[];
  addToTrip: (locationId: number) => void;
  removeFromTrip: (locationId: number) => void;
  isInTrip: (locationId: number) => boolean;
  tripCount: number;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const [tripLocationIds, setTripLocationIds] = useState<number[]>([]);

  // Load trip from localStorage on mount
  useEffect(() => {
    const savedTrip = localStorage.getItem('sriLankaTrip');
    if (savedTrip) {
      try {
        const parsedTrip = JSON.parse(savedTrip);
        setTripLocationIds(parsedTrip);
      } catch (error) {
        console.error('Error loading trip from localStorage:', error);
      }
    }
  }, []);

  // Save trip to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sriLankaTrip', JSON.stringify(tripLocationIds));
  }, [tripLocationIds]);

  const addToTrip = (locationId: number) => {
    setTripLocationIds(prev => {
      if (!prev.includes(locationId)) {
        return [...prev, locationId];
      }
      return prev;
    });
  };

  const removeFromTrip = (locationId: number) => {
    setTripLocationIds(prev => prev.filter(id => id !== locationId));
  };

  const isInTrip = (locationId: number) => {
    return tripLocationIds.includes(locationId);
  };

  const tripCount = tripLocationIds.length;

  return (
    <TripContext.Provider value={{
      tripLocationIds,
      addToTrip,
      removeFromTrip,
      isInTrip,
      tripCount
    }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
}