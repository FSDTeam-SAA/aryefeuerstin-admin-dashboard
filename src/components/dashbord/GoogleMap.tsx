// components/GoogleMap.tsx
"use client";

import { useEffect, useRef } from 'react';

interface Location {
  lat: number;
  lng: number;
  label?: string;
}

interface GoogleMapProps {
  locations: Location[];
  center?: Location;
  zoom?: number;
}

export default function GoogleMap({ 
  locations, 
  center = locations[0] || { lat: 23.8103, lng: 90.4125 },
  zoom = 12 
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    // Clear previous markers and directions
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
    }

    // Initialize map
    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
    });

    mapInstanceRef.current = map;

    if (locations.length === 0) return;

    // Add markers
    const bounds = new window.google.maps.LatLngBounds();
    
    locations.forEach((location, index) => {
      const marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map,
        label: {
          text: location.label || `${index + 1}`,
          color: 'white',
          fontWeight: 'bold',
        },
        title: location.label || `Location ${index + 1}`,
      });

      markersRef.current.push(marker);
      
      const position = marker.getPosition();
      if (position) {
        bounds.extend(position);
      }

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="padding: 8px;">
          <strong>${location.label || `Stop ${index + 1}`}</strong><br/>
          <span style="font-size: 12px; color: #666;">
            ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}
          </span>
        </div>`,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
    });

    // Fit bounds to show all markers
    if (locations.length > 1) {
      map.fitBounds(bounds);
    } else if (locations.length === 1) {
      map.setCenter({ lat: locations[0].lat, lng: locations[0].lng });
    }

    // Draw route if multiple locations
    if (locations.length > 1) {
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#4285F4',
          strokeWeight: 5,
          strokeOpacity: 0.8,
        },
      });

      directionsRendererRef.current = directionsRenderer;

      const waypoints = locations.slice(1, -1).map(loc => ({
        location: new window.google.maps.LatLng(loc.lat, loc.lng),
        stopover: true,
      }));

      directionsService.route(
        {
          origin: new window.google.maps.LatLng(locations[0].lat, locations[0].lng),
          destination: new window.google.maps.LatLng(
            locations[locations.length - 1].lat, 
            locations[locations.length - 1].lng
          ),
          waypoints,
          travelMode: window.google.maps.TravelMode.DRIVING,
          optimizeWaypoints: true,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK && result) {
            directionsRenderer.setDirections(result);
          } else {
            console.error('Directions request failed:', status);
          }
        }
      );
    }

    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
      }
    };
  }, [locations, center, zoom]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full min-h-[500px] rounded-lg border border-gray-200"
    />
  );
}