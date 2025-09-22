'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTrip } from '@/contexts/TripContext';

interface Location {
  id: number;
  name: string;
  province: string;
  description: string;
  image_url: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export default function LocationDetailClient({ id }: { id: string }) {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();
  const { addToTrip, isInTrip } = useTrip();

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch('/locations.json');
        const locations: Location[] = await response.json();
        const foundLocation = locations.find(loc => loc.id === parseInt(id as string));
        
        if (foundLocation) {
          setLocation(foundLocation);
        } else {
          setError(true);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching location:', error);
        setError(true);
        setLoading(false);
      }
    };

    if (id) {
      fetchLocation();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <div className="animate-pulse">
          <div className="h-[50vh] bg-gray-300"></div>
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="h-8 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Location not found</h1>
          <Button onClick={() => router.push('/')} className="bg-orange-600 hover:bg-orange-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const googleMapsUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&q=${location.coordinates.lat},${location.coordinates.lng}&zoom=12`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          onClick={() => router.push('/')}
          className="bg-white/90 text-gray-800 hover:bg-white shadow-lg backdrop-blur-sm"
          size="sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Hero Image */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={location.image_url}
          alt={location.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
        {/* Location Title Overlay */}
        <div className="absolute bottom-6 left-4 right-4 text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold mb-2 tracking-tight">
              {location.name}
            </h1>
            <div className="flex items-center text-lg md:text-xl text-orange-200">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{location.province}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Description */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">About This Destination</h2>
            {location && (
              <div className="mb-6">
                <Button
                  className={`px-6 ${isInTrip(location.id) ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'} text-white`}
                  onClick={() => addToTrip(location.id)}
                  disabled={isInTrip(location.id)}
                >
                  {isInTrip(location.id) ? 'Added ✓' : 'Add to Trip'}
                </Button>
              </div>
            )}
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                {location.description}
              </p>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Location</h2>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${location.coordinates.lat},${location.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in Google Maps
              </a>
            </div>
            
            <div className="rounded-xl overflow-hidden shadow-lg">
              <iframe
                src={googleMapsUrl}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map of ${location.name}`}
              ></iframe>
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                <span>
                  Coordinates: {location.coordinates.lat}, {location.coordinates.lng}
                </span>
              </div>
            </div>
          </div>

          {/* Back to Search Button */}
          <div className="text-center mt-8">
            <Button
              onClick={() => router.push('/')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Explore More Destinations
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


