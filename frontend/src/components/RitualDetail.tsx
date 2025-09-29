import React, { useState } from 'react';
import type { Ritual } from '../types/ritual';
import { ritualService } from '../services/ritualService';

interface RitualDetailProps {
  ritual: Ritual;
  onStartRitual: (ritual: Ritual) => void;
  onBack: () => void;
}

const RitualDetail: React.FC<RitualDetailProps> = ({ ritual, onStartRitual, onBack }) => {
  const [isStarting, setIsStarting] = useState(false);

  const handleStartRitual = async () => {
    try {
      setIsStarting(true);
      await ritualService.startRitual(ritual.id);
      onStartRitual(ritual);
    } catch (error) {
      console.error('Error starting ritual:', error);
      // TODO: Show error message
    } finally {
      setIsStarting(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'HARD':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes > 0 ? `${remainingMinutes} minutes` : ''}`;
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center text-white hover:text-purple-200 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Rituals
          </button>
          {ritual.isPremium && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gold-100 text-gold-800">
              ✨ Premium
            </span>
          )}
        </div>
        
        <h1 className="text-3xl font-bold mb-2">{ritual.title}</h1>
        {ritual.description && (
          <p className="text-purple-100 text-lg">{ritual.description}</p>
        )}
      </div>

      <div className="p-6">
        {/* Meta Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-2">⏱️</div>
            <div className="text-sm text-gray-600">Duration</div>
            <div className="font-semibold">{formatDuration(ritual.duration)}</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-2">📋</div>
            <div className="text-sm text-gray-600">Steps</div>
            <div className="font-semibold">{ritual.steps.length} steps</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-sm text-gray-600">Difficulty</div>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(ritual.difficulty)}`}>
              {ritual.difficulty}
            </span>
          </div>
        </div>

        {/* Features */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Features</h3>
          <div className="flex flex-wrap gap-3">
            {ritual.audioUrl && (
              <div className="flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8.586 17.414l4.95-4.95a1 1 0 00-1.414-1.414L7.172 16" />
                </svg>
                Audio Guidance
              </div>
            )}
            
            {ritual.location && (
              <div className="flex items-center px-3 py-2 bg-green-50 text-green-700 rounded-lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Sacred Location
              </div>
            )}
            
            <div className="flex items-center px-3 py-2 bg-purple-50 text-purple-700 rounded-lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Step-by-step Guide
            </div>
          </div>
        </div>

        {/* Tags */}
        {ritual.RitualToRitualTag.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {ritual.RitualToRitualTag.map((tagRelation, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize"
                  style={{
                    backgroundColor: tagRelation.ritual_tags.color + '20',
                    color: tagRelation.ritual_tags.color,
                    border: `1px solid ${tagRelation.ritual_tags.color}40`,
                  }}
                >
                  {tagRelation.ritual_tags.name.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Location Info */}
        {ritual.location && (
          <div className="mb-8 p-4 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-green-800">Sacred Location</h3>
            <div className="text-green-700">
              <h4 className="font-medium">{ritual.location.name}</h4>
              {ritual.location.description && (
                <p className="text-sm mt-1">{ritual.location.description}</p>
              )}
              <div className="flex items-center mt-2 text-sm">
                <span className="mr-4">Energy Level: {'⭐'.repeat(ritual.location.energyLevel)}</span>
                <span>Type: {ritual.location.type}</span>
              </div>
            </div>
          </div>
        )}

        {/* Steps Preview */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Ritual Steps</h3>
          <div className="space-y-3">
            {ritual.steps.map((step, index) => (
              <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                  {index + 1}
                </div>
                <p className="text-gray-700 flex-1">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={handleStartRitual}
            disabled={isStarting}
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isStarting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Starting Ritual...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start Ritual
              </>
            )}
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="text-amber-800 text-sm">
              <p className="font-medium mb-1">Before you begin:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Find a quiet, comfortable space where you won't be disturbed</li>
                <li>Gather any materials mentioned in the steps</li>
                <li>Set aside the full duration for the best experience</li>
                <li>Approach with an open mind and heart</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RitualDetail;
