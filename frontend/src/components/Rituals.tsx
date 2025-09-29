import React, { useState } from 'react';
import type { Ritual } from '../types/ritual';
import RitualsList from './RitualsList';
import RitualDetail from './RitualDetail';
import RitualRunner from './RitualRunner';

type ViewState = 'list' | 'detail' | 'runner';

const Rituals: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('list');
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null);

  const handleSelectRitual = (ritual: Ritual) => {
    setSelectedRitual(ritual);
    setCurrentView('detail');
  };

  const handleStartRitual = (ritual: Ritual) => {
    setSelectedRitual(ritual);
    setCurrentView('runner');
  };

  const handleCompleteRitual = () => {
    // Could show completion animation or redirect
    setCurrentView('list');
    setSelectedRitual(null);
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedRitual(null);
  };

  const handleBackToDetail = () => {
    setCurrentView('detail');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'list' && (
        <div className="container mx-auto px-4 py-8">
          <RitualsList onSelectRitual={handleSelectRitual} />
        </div>
      )}

      {currentView === 'detail' && selectedRitual && (
        <div className="container mx-auto px-4 py-8">
          <RitualDetail
            ritual={selectedRitual}
            onStartRitual={handleStartRitual}
            onBack={handleBackToList}
          />
        </div>
      )}

      {currentView === 'runner' && selectedRitual && (
        <RitualRunner
          ritual={selectedRitual}
          onComplete={handleCompleteRitual}
          onExit={handleBackToDetail}
        />
      )}
    </div>
  );
};

export default Rituals;
