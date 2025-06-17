"use client";

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCanadianCities } from "../lib/getCanadianCities";

// Initialize Mapbox with your token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export default function Map({ locationValue }: { locationValue: string }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { getCityByValue } = useCanadianCities();
  const latLang = getCityByValue(locationValue)?.latLang;
  // Swap to [lng, lat] for Mapbox
  const mapboxCoords: [number, number] = latLang && latLang.length === 2
    ? [latLang[1], latLang[0]]
    : [-0.09, 52.505];

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: mapboxCoords,
      zoom: 8
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add marker
    new mapboxgl.Marker()
      .setLngLat(mapboxCoords)
      .addTo(map.current);

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [mapboxCoords]);

  return (
    <div 
      ref={mapContainer} 
      className="h-[50vh] rounded-lg relative z-0"
    />
  );
}
