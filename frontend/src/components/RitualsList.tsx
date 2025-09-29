import React, { useState, useEffect } from 'react';
import type { Ritual } from '../types/ritual';
import { ritualService } from '../services/ritualService';

interface RitualsListProps {
  onSelectRitual: (ritual: Ritual) => void;
}

const RitualsList: React.FC<RitualsListProps> = ({ onSelectRitual }) => {
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  useEffect(() => {
    loadRituals();
  }, [selectedCategory, selectedDifficulty]);

  const loadRituals = async () => {
    try {
      setLoading(true);
      let ritualsData: Ritual[];

      if (selectedCategory !== 'all') {
        ritualsData = await ritualService.getRitualsByCategory(selectedCategory);
      } else if (selectedDifficulty !== 'all') {
        ritualsData = await ritualService.getRitualsByDifficulty(selectedDifficulty);
      } else {
        ritualsData = await ritualService.getAllRituals();
      }

      setRituals(ritualsData);
    } catch (err) {
      setError('Failed to load rituals');
      console.error('Error loading rituals:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'bg-green-100 text-green-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'HARD':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ''}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadRituals}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sacred Rituals</h1>
        <p className="text-gray-600">Discover and practice ancient wisdom</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="cleansing">Cleansing</option>
            <option value="manifestation">Manifestation</option>
            <option value="energy_work">Energy Work</option>
            <option value="healing">Healing</option>
            <option value="protection">Protection</option>
            <option value="daily_practice">Daily Practice</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Levels</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
      </div>

      {/* Rituals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rituals?.map((ritual) => (
          <div
            key={ritual.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
            onClick={() => onSelectRitual(ritual)}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {ritual.title}
                </h3>
                {ritual.isPremium && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gold-100 text-gold-800">
                    ✨ Premium
                  </span>
                )}
              </div>

              {/* Description */}
              {ritual.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {ritual.description}
                </p>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {ritual.RitualToRitualTag.slice(0, 2).map((tagRelation, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: tagRelation.ritual_tags.color + '20',
                      color: tagRelation.ritual_tags.color,
                    }}
                  >
                    {tagRelation.ritual_tags.name}
                  </span>
                ))}
              </div>

              {/* Meta Info */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>⏱️ {formatDuration(ritual.duration)}</span>
                  {ritual.audioUrl && <span>🎵 Audio</span>}
                  {ritual.location && <span>📍 Location</span>}
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(ritual.difficulty)}`}>
                  {ritual.difficulty}
                </span>
              </div>

              {/* Steps Count */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className="text-sm text-gray-500">
                  {ritual.steps?.length} steps
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {rituals?.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No rituals found</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};

export default RitualsList;
