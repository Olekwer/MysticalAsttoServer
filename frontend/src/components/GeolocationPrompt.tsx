import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../config/api';
import { useAuthStore } from '../stores/authStore';
import mapboxgl from 'mapbox-gl';
import LocationPicker from './LocationPicker';
import AddressAutocomplete from './AddressAutocomplete';

interface GeolocationPromptProps {
  onLocationUpdated: (location?: {latitude: number, longitude: number}) => void;
  onSkip: () => void;
}

const GeolocationPrompt: React.FC<GeolocationPromptProps> = ({ onLocationUpdated, onSkip }) => {
  const { token } = useAuthStore();
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Mapbox access token
  const MAPBOX_TOKEN = 'pk.eyJ1Ijoib2xld2VyIiwiYSI6ImNtZmxoanU0ZzA1MGEybHM3cDVkY25tMjUifQ.wH75vZJKfx-wJVl1bAbr-A';

  useEffect(() => {
    // Check if geolocation is supported
    setIsSupported('geolocation' in navigator);
    
    // Set Mapbox access token
    mapboxgl.accessToken = MAPBOX_TOKEN;
  }, []);


  const handleGetLocation = async () => {
    if (!isSupported) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsRequesting(true);
    setError(null);

    try {
      // Get user's current position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;

      // Send location to backend
      const response = await fetch(getApiUrl('/location/update-location'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          latitude,
          longitude
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update location');
      }

      onLocationUpdated({ latitude, longitude });
    } catch (err) {
      console.error('Geolocation error:', err);
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location access denied. We will use your IP location instead.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information unavailable. We will use your IP location instead.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out. We will use your IP location instead.');
            break;
          default:
            setError('An unknown error occurred. We will use your IP location instead.');
            break;
        }
      } else {
        setError('Failed to update location. We will use your IP location instead.');
      }
    } finally {
      setIsRequesting(false);
    }
  };

  const handleUseIPLocation = async () => {
    setIsRequesting(true);
    setError(null);

    try {
      // Send request without coordinates to use IP-based location
      const response = await fetch(getApiUrl('/location/update-location'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error('Failed to update location');
      }

      onLocationUpdated({ latitude: 0, longitude: 0 }); // IP location will be determined by backend
    } catch (err) {
      console.error('IP location error:', err);
      setError('Failed to determine your location. Using default power places.');
    } finally {
      setIsRequesting(false);
    }
  };


  const handleAddressSelect = (location: { latitude: number; longitude: number; address: string }) => {
    setSearchQuery(location.address);
    handleSelectLocation({
      center: [location.longitude, location.latitude],
      place_name: location.address
    });
  };

  const handleSelectLocation = async (place: any) => {
    const [longitude, latitude] = place.center;
    
    setIsRequesting(true);
    setError(null);

    try {
      // Send location to backend
      const response = await fetch(getApiUrl('/location/update-location'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          latitude,
          longitude
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update location');
      }

      onLocationUpdated({ latitude, longitude });
    } catch (err) {
      console.error('Location update error:', err);
      setError('Failed to update location. Please try again.');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleMapLocationSelected = async (location: { latitude: number; longitude: number; address?: string }) => {
    setIsRequesting(true);
    setError(null);

    try {
      // Send location to backend
      const response = await fetch(getApiUrl('/location/update-location'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update location');
      }

      onLocationUpdated({ latitude: location.latitude, longitude: location.longitude });
    } catch (err) {
      console.error('Location update error:', err);
      setError('Failed to update location. Please try again.');
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 p-8 rounded-xl w-full max-w-md border border-white/20">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            📍
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Find Your Power Places
          </h2>
          <p className="text-white/70">
            We can find the 7 nearest mystical power places within 60km of your location to personalize your experience.
          </p>
        </div>

        <div className="space-y-4">
          {isSupported && (
            <button
              onClick={handleGetLocation}
              disabled={isRequesting}
              className="mystical-button w-full"
            >
              {isRequesting ? 'Getting Location...' : 'Use My Location'}
            </button>
          )}

          {/* Address Autocomplete */}
          <div className="space-y-2">
            <AddressAutocomplete
              value={searchQuery}
              onChange={setSearchQuery}
              onSelect={handleAddressSelect}
              placeholder="Type a city or address..."
              disabled={isRequesting}
              className="w-full"
            />
          </div>

          <button
            onClick={() => setShowLocationPicker(true)}
            disabled={isRequesting}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-400 rounded-lg text-white font-semibold hover:from-purple-600 hover:to-purple-500 transition-all"
          >
            📍 Choose on Map
          </button>

          <button
            onClick={handleUseIPLocation}
            disabled={isRequesting}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-semibold hover:bg-white/20 transition-all"
          >
            {isRequesting ? 'Determining Location...' : 'Use IP Location'}
          </button>

          <button
            onClick={onSkip}
            disabled={isRequesting}
            className="w-full px-4 py-3 text-white/60 hover:text-white transition-colors"
          >
            Skip for now
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-xs text-white/50">
            Your location data is only used to find nearby power places and is not stored permanently.
          </p>
        </div>
      </div>

      {/* Location Picker Modal */}
      <LocationPicker
        isOpen={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onLocationSelected={handleMapLocationSelected}
      />
    </div>
  );
};

export default GeolocationPrompt;
