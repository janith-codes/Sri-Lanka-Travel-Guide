'use client';

import { useEffect, useMemo } from 'react';
import { APIProvider, Map, Marker, Polyline, useMap } from '@vis.gl/react-google-maps';

export type TripLocation = {
  id: number;
  name: string;
  province: string;
  coordinates: { lat: number; lng: number };
};

type Props = {
  locations: TripLocation[];
  path?: google.maps.LatLngLiteral[];
};

const mapId = 'trip-map';

function FitBounds({ locations }: { locations: TripLocation[] }) {
  const map = useMap(mapId);

  useEffect(() => {
    if (!map || locations.length === 0) return;
    const bounds = new window.google.maps.LatLngBounds();
    locations.forEach((loc) => bounds.extend(loc.coordinates));
    map.fitBounds(bounds, 48);
  }, [map, locations]);

  return null;
}

export default function TripMap({ locations, path }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string | undefined;

  // Fallback center if no locations
  const defaultCenter = useMemo(() => {
    if (locations.length > 0) return locations[0].coordinates;
    return { lat: 7.8731, lng: 80.7718 }; // Sri Lanka center-ish
  }, [locations]);

  if (!apiKey) {
    return (
      <div className="w-full h-[400px] md:h-full flex items-center justify-center bg-gray-100 text-gray-600 rounded-xl">
        Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="w-full h-[400px] md:h-full">
        <Map
          id={mapId}
          mapId={mapId}
          defaultCenter={defaultCenter}
          defaultZoom={7}
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          <FitBounds locations={locations} />
          {locations.map((loc) => (
            <Marker key={loc.id} position={loc.coordinates} title={loc.name} />
          ))}
          {path && path.length > 1 && (
            <Polyline path={path} options={{ strokeColor: '#ea580c', strokeWeight: 5 }} />
          )}
        </Map>
      </div>
    </APIProvider>
  );
}



