import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: {
    name: string;
    coordinates: [number, number]; // [longitude, latitude]
    distance?: number; // Distance in kilometers
  };
  userLocation?: {
    latitude: number;
    longitude: number;
  };
}

const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose, location, userLocation }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const powerPlaceMarker = useRef<mapboxgl.Marker | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);

  useEffect(() => {
    if (!isOpen || !mapContainer.current) return;

    // Set Mapbox access token
    mapboxgl.accessToken = 'pk.eyJ1Ijoib2xld2VyIiwiYSI6ImNtZmxoanU0ZzA1MGEybHM3cDVkY25tMjUifQ.wH75vZJKfx-wJVl1bAbr-A';

    // Calculate center point between user location and power place
    let center = location.coordinates;
    let zoom = 12;
    
    if (userLocation) {
      center = [
        (userLocation.longitude + location.coordinates[0]) / 2,
        (userLocation.latitude + location.coordinates[1]) / 2
      ];
      zoom = 10; // Zoom out to show both locations
    }

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: center,
      zoom: zoom,
      attributionControl: false
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl());

    // Create power place marker
    const powerPlaceElement = document.createElement('div');
    powerPlaceElement.className = 'w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center';
    powerPlaceElement.innerHTML = '<div class="w-4 h-4 bg-white rounded-full"></div>';

    powerPlaceMarker.current = new mapboxgl.Marker(powerPlaceElement)
      .setLngLat(location.coordinates)
      .addTo(map.current);

    // Create user location marker if available
    if (userLocation) {
      const userElement = document.createElement('div');
      userElement.className = 'w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center';
      userElement.innerHTML = '<div class="w-2 h-2 bg-white rounded-full"></div>';

      userMarker.current = new mapboxgl.Marker(userElement)
        .setLngLat([userLocation.longitude, userLocation.latitude])
        .addTo(map.current);
    }

    // Create popup for power place
    const distanceText = location.distance ? `${location.distance.toFixed(1)} km away` : 'Your Power Point';
    popup.current = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      anchor: 'bottom'
    })
      .setLngLat(location.coordinates)
      .setHTML(`
        <div class="text-center p-2">
          <div class="font-semibold text-slate-800">${location.name}</div>
          <div class="text-sm text-slate-600">${distanceText}</div>
        </div>
      `)
      .addTo(map.current);

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      powerPlaceMarker.current = null;
      userMarker.current = null;
      popup.current = null;
    };
  }, [isOpen, location]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl w-full max-w-4xl h-[80vh] border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white">Power Point Location</h2>
            {location.distance && (
              <p className="text-sm text-white/70">
                {location.distance.toFixed(1)} km from your location
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Map Container */}
        <div 
          ref={mapContainer} 
          className="h-[calc(100%-80px)] w-full"
        />

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="flex justify-between items-center">
            <div className="text-sm text-white/70">
              {location.name}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg text-white font-semibold hover:from-blue-600 hover:to-blue-500 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapModal;