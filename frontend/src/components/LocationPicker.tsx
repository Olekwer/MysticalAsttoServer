import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface LocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelected: (location: { latitude: number; longitude: number; address?: string }) => void;
  initialLocation?: { latitude: number; longitude: number };
}

const LocationPicker: React.FC<LocationPickerProps> = ({ 
  isOpen, 
  onClose, 
  onLocationSelected, 
  initialLocation 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number; address?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mapbox access token
  const MAPBOX_TOKEN = 'pk.eyJ1Ijoib2xld2VyIiwiYSI6ImNtZmxoanU0ZzA1MGEybHM3cDVkY25tMjUifQ.wH75vZJKfx-wJVl1bAbr-A';

  useEffect(() => {
    if (!isOpen || !mapContainer.current) return;

    // Set Mapbox access token
    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: initialLocation ? [initialLocation.longitude, initialLocation.latitude] : [0, 0],
      zoom: initialLocation ? 10 : 2,
      attributionControl: false
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl());

    // Create marker
    const markerElement = document.createElement('div');
    markerElement.className = 'w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer';
    markerElement.innerHTML = '<div class="w-4 h-4 bg-white rounded-full"></div>';

    marker.current = new mapboxgl.Marker({
      element: markerElement,
      draggable: true
    });

    if (initialLocation) {
      marker.current.setLngLat([initialLocation.longitude, initialLocation.latitude]);
      setSelectedLocation({
        latitude: initialLocation.latitude,
        longitude: initialLocation.longitude
      });
    }

    marker.current.addTo(map.current);

    // Handle map click
    const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
      if (marker.current) {
        marker.current.setLngLat(e.lngLat);
        setSelectedLocation({
          latitude: e.lngLat.lat,
          longitude: e.lngLat.lng
        });
        reverseGeocode(e.lngLat.lat, e.lngLat.lng);
      }
    };

    // Handle marker drag
    const handleMarkerDrag = () => {
      if (marker.current) {
        const lngLat = marker.current.getLngLat();
        setSelectedLocation({
          latitude: lngLat.lat,
          longitude: lngLat.lng
        });
        reverseGeocode(lngLat.lat, lngLat.lng);
      }
    };

    map.current.on('click', handleMapClick);
    marker.current.on('dragend', handleMarkerDrag);

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      marker.current = null;
    };
  }, [isOpen, initialLocation]);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&types=place,locality,neighborhood,address`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          setSelectedLocation(prev => ({
            ...prev!,
            address: data.features[0].place_name
          }));
        }
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelected(selectedLocation);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl w-full max-w-4xl h-[80vh] border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white">Select Your Location</h2>
            <p className="text-sm text-white/70">
              Click on the map or drag the marker to select your location
            </p>
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
          className="h-[calc(100%-160px)] w-full"
        />

        {/* Selected Location Info */}
        {selectedLocation && (
          <div className="p-4 border-t border-white/10">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">Selected Location</h3>
              <div className="text-sm text-white/70">
                <div>Latitude: {selectedLocation.latitude.toFixed(6)}</div>
                <div>Longitude: {selectedLocation.longitude.toFixed(6)}</div>
                {selectedLocation.address && (
                  <div className="mt-1 text-white/90">{selectedLocation.address}</div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg text-white font-semibold hover:from-blue-600 hover:to-blue-500 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Confirming...' : 'Confirm Location'}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-semibold hover:bg-white/20 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
