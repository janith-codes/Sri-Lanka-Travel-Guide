'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, ArrowLeft, Trash2, ExternalLink } from 'lucide-react';
import { useTrip } from '@/contexts/TripContext';
import { Button } from '@/components/ui/button';
import TripMap from '@/components/TripMap';

interface Location {
  id: number;
  name: string;
  province: string;
  category: string;
  description: string;
  image_url: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export default function ItineraryPage() {
  const { tripLocationIds, removeFromTrip, tripCount } = useTrip();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [path, setPath] = useState<google.maps.LatLngLiteral[] | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const fetchTripLocations = async () => {
      if (tripLocationIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/locations.json');
        const allLocations: Location[] = await response.json();
        const tripLocations = allLocations.filter(loc => tripLocationIds.includes(loc.id));
        
        // Sort locations by the order they were added to the trip
        const sortedLocations = tripLocationIds.map(id => 
          tripLocations.find(loc => loc.id === id)
        ).filter(Boolean) as Location[];
        
        setLocations(sortedLocations);
      } catch (error) {
        console.error('Error fetching trip locations:', error);
      }
      setLoading(false);
    };

    fetchTripLocations();
  }, [tripLocationIds]);

  const canOptimize = locations.length >= 2;

  const tripLocationsForMap = useMemo(
    () =>
      locations.map((l) => ({
        id: l.id,
        name: l.name,
        province: l.province,
        coordinates: l.coordinates,
      })),
    [locations]
  );

  const optimizeRoute = async () => {
    if (!canOptimize) return;
    if (!(window as any).google?.maps) return;

    const origin = locations[0];
    const destination = locations[locations.length - 1];
    const middle = locations.slice(1, -1);

    const waypoints: google.maps.DirectionsWaypoint[] = middle.map((loc) => ({
      location: new google.maps.LatLng(loc.coordinates.lat, loc.coordinates.lng),
      stopover: true,
    }));

    const service = new google.maps.DirectionsService();
    const request: google.maps.DirectionsRequest = {
      origin: new google.maps.LatLng(origin.coordinates.lat, origin.coordinates.lng),
      destination: new google.maps.LatLng(destination.coordinates.lat, destination.coordinates.lng),
      waypoints,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    service.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        const order = result.routes[0].waypoint_order || [];
        const optimized = [origin, ...order.map((i) => middle[i]), destination];
        setLocations(optimized);
        const overviewPath = result.routes[0].overview_path as google.maps.LatLng[];
        if (overviewPath && overviewPath.length > 0) {
          setPath(overviewPath.map((p) => ({ lat: p.lat(), lng: p.lng() })));
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded mb-8"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-6 bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => router.push('/')}
                  variant="outline"
                  size="sm"
                  className="hover:bg-orange-50 hover:border-orange-300"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Search
                </Button>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Your Trip Itinerary
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {tripCount} {tripCount === 1 ? 'destination' : 'destinations'} planned
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {tripCount === 0 ? (
            // Empty State
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-md mx-auto">
                <div className="text-gray-400 mb-6">
                  <MapPin className="h-16 w-16 mx-auto" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Your trip is empty
                </h2>
                <p className="text-gray-600 mb-8">
                  Start planning your Sri Lankan adventure by adding some amazing destinations to your itinerary.
                </p>
                <Button
                  onClick={() => router.push('/')}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Discover Destinations
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Left: Controls + Ordered List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button
                    onClick={optimizeRoute}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                    disabled={!canOptimize}
                    title={!canOptimize ? 'Add at least 2 locations to optimize' : 'Optimize route'}
                  >
                    Optimize Route
                  </Button>
                </div>
                <ol className="list-decimal list-inside space-y-2 bg-white rounded-2xl p-4 shadow">
                  {locations.map((location) => (
                    <li key={location.id} className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-gray-800">{location.name}</div>
                        <div className="text-sm text-gray-600">{location.province}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => router.push(`/location/${location.id}`)}
                          variant="outline"
                          className="hover:bg-orange-50 hover:border-orange-300"
                          size="sm"
                        >
                          View
                        </Button>
                        <Button
                          onClick={() => removeFromTrip(location.id)}
                          variant="outline"
                          className="hover:bg-red-50 hover:border-red-300"
                          size="sm"
                        >
                          Remove
                        </Button>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Right: Map */}
              <div className="bg-white rounded-2xl shadow p-2 md:p-3 h-full">
                <TripMap locations={tripLocationsForMap} path={path} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}