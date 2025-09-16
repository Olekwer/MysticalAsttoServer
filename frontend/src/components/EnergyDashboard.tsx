import React, { useEffect, useState } from 'react';
import { getApiUrl } from '../config/api';

interface EnergyData {
  date: {
    dayOfWeek: string;
    fullDate: string;
  };
  energy: {
    level: number;
    percentage: number;
    message: string;
  };
  moon: {
    phase: string;
    description: string;
    message: string;
  };
  ritual: {
    name: string;
    message: string;
  };
  weeklyInsight: {
    text: string;
  };
}

const EnergyDashboard: React.FC = () => {
  const [energyData, setEnergyData] = useState<EnergyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEnergyData = async () => {
      setIsLoading(true);
      try {
        // Try to fetch from health endpoint first
        const response = await fetch(getApiUrl('/health/demo-energy'));
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setEnergyData(data);
      } catch (error) {
        console.error('Error loading energy data:', error);
        // Fallback to mock data
        const today = new Date();
        const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
        const dateStr = today.toLocaleDateString('en-US', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        });
        
        const mockData: EnergyData = {
          date: {
            dayOfWeek: dayOfWeek,
            fullDate: dateStr
          },
          energy: {
            level: 0.9,
            percentage: 90,
            message: "High energy - use it wisely"
          },
          moon: {
            phase: "Waxing Crescent - Energy Growing",
            description: "Waxing - energy grows",
            message: "Lunar energy supports your intentions"
          },
          ritual: {
            name: "Morning Meditation",
            message: "Start your day in peace"
          },
          weeklyInsight: {
            text: "Observe the rhythms of your energy. Each day brings different gifts and challenges. Adapt your practice to natural cycles."
          }
        };
        setEnergyData(mockData);
      } finally {
        setIsLoading(false);
      }
    };

    loadEnergyData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96 text-xl text-white/80">
        🔮 Loading your energy data...
      </div>
    );
  }

  if (!energyData) {
    return (
      <div className="flex justify-center items-center h-96 text-xl text-red-500">
        ❌ Failed to load energy data
      </div>
    );
  }

  return (
    <div className="mb-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
          Your Energy Today
        </h1>
        <p className="text-xl text-white/80 italic">
          {energyData.date.fullDate}
        </p>
      </div>

      {/* Energy Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {/* Energy Level Card */}
        <div className="energy-card">
          <h3 className="text-lg font-semibold mb-6 text-white/90">
            Energy Level
          </h3>
          <div className="relative mb-6">
            <div className="energy-bar">
              <div 
                className="energy-bar-fill"
                style={{ width: `${energyData.energy.percentage}%` }}
              />
            </div>
            <span className="absolute right-0 -top-6 bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm font-semibold">
              {energyData.energy.percentage}%
            </span>
          </div>
          <p className="text-sm text-white/80 mt-4">
            {energyData.energy.message}
          </p>
        </div>

        {/* Moon Phase Card */}
        <div className="energy-card">
          <h3 className="text-lg font-semibold mb-6 text-white/90">
            🌙 Moon Phase
          </h3>
          <div className="text-xl font-semibold text-white mb-4">
            {energyData.moon.phase}
          </div>
          <p className="text-sm text-white/80 mt-4">
            {energyData.moon.message}
          </p>
        </div>

        {/* Daily Ritual Card */}
        <div className="energy-card">
          <h3 className="text-lg font-semibold mb-6 text-white/90">
            ✨ Daily Ritual
          </h3>
          <div className="text-xl font-semibold text-white mb-4">
            {energyData.ritual.name}
          </div>
          <p className="text-sm text-white/80 mt-4">
            {energyData.ritual.message}
          </p>
        </div>
      </div>

      {/* Weekly Insight */}
      <div className="energy-card">
        <h3 className="text-lg font-semibold mb-4 text-white/90">
          Weekly Insight:
        </h3>
        <p className="text-base text-white/80 italic leading-relaxed">
          {energyData.weeklyInsight.text}
        </p>
      </div>
    </div>
  );
};

export default EnergyDashboard;
