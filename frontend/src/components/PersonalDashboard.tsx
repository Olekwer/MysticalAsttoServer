import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { getApiUrl, API_CONFIG } from '../config/api';
import EnergyDashboard from './EnergyDashboard';
import BirthDateForm from './BirthDateForm';
import MapModal from './MapModal';
import GeolocationPrompt from './GeolocationPrompt';

interface UserProfile {
  zodiacSign: string;
  element: string;
  powerPlace: {
    name: string;
    distance: number;
  };
  powerStone: {
    name: string;
    description: string;
  };
  progress: {
    ritualsCompleted: number;
  };
}

const PersonalDashboard: React.FC = () => {
  const { user, logout, token } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBirthDateForm, setShowBirthDateForm] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showGeolocationPrompt, setShowGeolocationPrompt] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.USERS.DASHBOARD), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const dashboardData = await response.json();
        
        const profileData: UserProfile = {
          zodiacSign: dashboardData.user.zodiacSign,
          element: dashboardData.user.element,
          powerPlace: dashboardData.powerPlace,
          powerStone: dashboardData.powerStone,
          progress: dashboardData.progress
        };
        
        setProfile(profileData);
        setUserData(dashboardData.user);
        
        // Check if user has location-based power places
        // If not, show geolocation prompt
        if (!dashboardData.powerPlace || dashboardData.powerPlace.name.includes('Greece') || dashboardData.powerPlace.name.includes('UK') || dashboardData.powerPlace.distance > 50) {
          setShowGeolocationPrompt(true);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        // Fallback to mock data if API fails
        const mockProfile: UserProfile = {
          zodiacSign: 'PISCES',
          element: getElementForSign('PISCES'),
          powerPlace: {
            name: 'Lake Błędno',
            distance: 14
          },
          powerStone: {
            name: 'Aquamarine',
            description: 'stone of peace'
          },
          progress: {
            ritualsCompleted: 0
          }
        };
        setProfile(mockProfile);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleUserUpdate = (updatedUser: any) => {
    setUserData(updatedUser);
    if (profile) {
      setProfile({
        ...profile,
        zodiacSign: updatedUser.zodiacSign,
        element: updatedUser.element
      });
    }
  };

  const handleLocationUpdated = (location?: {latitude: number, longitude: number}) => {
    setShowGeolocationPrompt(false);
    if (location) {
      setUserLocation(location);
    }
    // Reload profile to get updated power places
    window.location.reload();
  };

  const handleSkipGeolocation = () => {
    setShowGeolocationPrompt(false);
  };

  const getPowerPlaceCoordinates = (placeName: string): [number, number] => {
    // Map of power places to coordinates [longitude, latitude]
    const powerPlaces: { [key: string]: [number, number] } = {
      'Mount Olympus, Greece': [22.3556, 40.0853],
      'Stonehenge, UK': [-1.8262, 51.1789],
      'Machu Picchu, Peru': [-72.5449, -13.1631],
      'Lake Błędno, Poland': [19.0238, 50.2649],
      'Pyramids of Giza, Egypt': [31.1342, 29.9792],
      'Glastonbury Tor, UK': [-2.7036, 51.1444],
      'Temple of Delphi, Greece': [22.4942, 38.4823],
      'Sedona Vortex, USA': [-111.7609, 34.8697],
      'Uluru, Australia': [131.0369, -25.3444],
      'Mount Fuji, Japan': [138.7274, 35.3606],
      'Crystal Cave, Iceland': [-19.0208, 64.9631],
      'Sedona, Arizona': [-111.7609, 34.8697],
      'Mount Shasta, California': [-122.3125, 41.4096],
      'Bali, Indonesia': [115.1889, -8.3405]
    };
    
    return powerPlaces[placeName] || [0, 0]; // Default coordinates if not found
  };

  const getElementForSign = (sign: string): string => {
    const elementMap: { [key: string]: string } = {
      'ARIES': 'Fire',
      'TAURUS': 'Earth',
      'GEMINI': 'Air',
      'CANCER': 'Water',
      'LEO': 'Fire',
      'VIRGO': 'Earth',
      'LIBRA': 'Air',
      'SCORPIO': 'Water',
      'SAGITTARIUS': 'Fire',
      'CAPRICORN': 'Earth',
      'AQUARIUS': 'Air',
      'PISCES': 'Water'
    };
    return elementMap[sign] || 'Water';
  };

  const getSignInEnglish = (sign: string): string => {
    const signMap: { [key: string]: string } = {
      'ARIES': 'Aries',
      'TAURUS': 'Taurus',
      'GEMINI': 'Gemini',
      'CANCER': 'Cancer',
      'LEO': 'Leo',
      'VIRGO': 'Virgo',
      'LIBRA': 'Libra',
      'SCORPIO': 'Scorpio',
      'SAGITTARIUS': 'Sagittarius',
      'CAPRICORN': 'Capricorn',
      'AQUARIUS': 'Aquarius',
      'PISCES': 'Pisces'
    };
    return signMap[sign] || 'Pisces';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white">
        <div className="text-center text-2xl animate-pulse">
          🔮 Loading your mystical profile...
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white">
        <div className="text-center">
          <div className="text-3xl mb-4">❌</div>
          <div>Failed to load profile</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-12 py-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full flex items-center justify-center text-2xl">
            ⭐
          </div>
          <h1 className="text-2xl font-semibold m-0 bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
            Earth's Core
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-white/10 rounded-lg text-sm">
            {getSignInEnglish(profile.zodiacSign)} • {profile.element.toLowerCase()}
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white cursor-pointer transition-all duration-300 hover:bg-white/20"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="text-center mb-12">
        <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
          Welcome to Your Power Zone
        </h2>
        <p className="text-xl text-white/80 m-0 italic">
          Your energy has its place. Enter the path of healing.
        </p>
      </main>

      {/* Energy Dashboard */}
      <EnergyDashboard />

      {/* Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {/* Your Sign Card */}
        <div className="mystical-card text-center">
          <div className="w-15 h-15 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
            ⭐
          </div>
          <h3 className="text-lg font-semibold mb-2 text-white/90">
            Your Sign
          </h3>
          <div className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
            {getSignInEnglish(profile.zodiacSign)}
          </div>
          <div className="text-base text-white/70 capitalize mb-4">
            {profile.element}
          </div>
          {userData?.birthDate && (
            <div className="text-sm text-white/60 mb-4">
              Born: {new Date(userData.birthDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          )}
          <button
            onClick={() => setShowBirthDateForm(true)}
            className="mystical-button w-full text-sm"
          >
            {userData?.birthDate ? 'Update Birth Info' : 'Add Birth Info'}
          </button>
        </div>

        {/* Power Point Card */}
        <div className="mystical-card text-center">
          <div className="w-15 h-15 bg-gradient-to-r from-red-500 to-red-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
            📍
          </div>
          <h3 className="text-lg font-semibold mb-2 text-white/90">
            Power Point
          </h3>
          <div className="text-xl font-semibold mb-6 text-white">
            {profile.powerPlace.name}, {profile.powerPlace.distance} km
          </div>
                      <button 
                        onClick={() => setShowMap(true)}
                        className="mystical-button w-full bg-gradient-to-r from-red-500 to-red-400 hover:from-red-600 hover:to-red-500"
                      >
                        See on map
                      </button>
        </div>

        {/* Power Stone Card */}
        <div className="mystical-card text-center">
          <div className="w-15 h-15 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
            💎
          </div>
          <h3 className="text-lg font-semibold mb-2 text-white/90">
            Power Stone
          </h3>
          <div className="text-xl font-semibold mb-2 text-white">
            {profile.powerStone.name}
          </div>
          <div className="text-sm text-white/70 mb-6">
            {profile.powerStone.description}
          </div>
          <button className="mystical-button w-full">
            Learn more
          </button>
        </div>

        {/* Progress Card */}
        <div className="mystical-card text-center">
          <div className="w-15 h-15 bg-gradient-to-r from-pink-500 to-pink-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
            ❤️
          </div>
          <h3 className="text-lg font-semibold mb-2 text-white/90">
            Progress
          </h3>
          <div className="text-xl font-semibold mb-6 text-white">
            {profile.progress.ritualsCompleted} rituals completed
          </div>
          <button className="mystical-button w-full bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500">
            My path
          </button>
        </div>
      </div>

      {/* Birth Date Form Modal */}
      {showBirthDateForm && (
        <BirthDateForm
          currentBirthDate={userData?.birthDate}
          currentBirthTime={userData?.birthTime}
          currentBirthPlace={userData?.birthPlace}
          onUpdate={handleUserUpdate}
          onClose={() => setShowBirthDateForm(false)}
        />
      )}

      {/* Map Modal */}
      {showMap && profile && (
        <MapModal
          isOpen={showMap}
          onClose={() => setShowMap(false)}
          location={{
            name: profile.powerPlace.name,
            coordinates: getPowerPlaceCoordinates(profile.powerPlace.name),
            distance: profile.powerPlace.distance
          }}
          userLocation={userLocation || undefined}
        />
      )}

      {/* Geolocation Prompt */}
      {showGeolocationPrompt && (
        <GeolocationPrompt
          onLocationUpdated={handleLocationUpdated}
          onSkip={handleSkipGeolocation}
        />
      )}
    </div>
  );
};

export default PersonalDashboard;
