import React, { useState, useEffect, useRef } from 'react';
import type { Ritual, RitualStep } from '../types/ritual';
import { ritualService } from '../services/ritualService';

interface RitualRunnerProps {
  ritual: Ritual;
  onComplete: () => void;
  onExit: () => void;
}

const RitualRunner: React.FC<RitualRunnerProps> = ({ ritual, onComplete, onExit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const steps: RitualStep[] = ritual.steps.map((step, index) => ({
    id: index,
    text: step,
    completed: false,
  }));

  const [ritualSteps, setRitualSteps] = useState<RitualStep[]>(steps);

  useEffect(() => {
    // Update progress when step changes
    const progress = Math.round((currentStep / ritual.steps.length) * 100);
    updateProgress(progress);
  }, [currentStep]);

  useEffect(() => {
    // Initialize audio if available
    if (ritual.audioUrl && audioRef.current) {
      audioRef.current.src = ritual.audioUrl;
      audioRef.current.loop = true;
    }
  }, [ritual.audioUrl]);

  const updateProgress = async (progress: number) => {
    try {
      await ritualService.updateRitualProgress(ritual.id, progress);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current || !ritual.audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const nextStep = () => {
    if (currentStep < ritual.steps.length - 1) {
      // Mark current step as completed
      setRitualSteps(prev => prev.map((step, index) => 
        index === currentStep ? { ...step, completed: true } : step
      ));
      setCurrentStep(currentStep + 1);
    } else {
      // Last step completed, show completion options
      setRitualSteps(prev => prev.map((step, index) => 
        index === currentStep ? { ...step, completed: true } : step
      ));
      setShowNotes(true);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Mark next step as not completed
      setRitualSteps(prev => prev.map((step, index) => 
        index === currentStep ? { ...step, completed: false } : step
      ));
    }
  };

  const handleComplete = async () => {
    try {
      setIsCompleting(true);
      await ritualService.completeRitual(ritual.id, notes);
      
      // Stop audio if playing
      if (isPlaying && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      
      onComplete();
    } catch (error) {
      console.error('Error completing ritual:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleExit = () => {
    // Stop audio if playing
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    onExit();
  };

  const openLocationMap = () => {
    if (ritual.location) {
      const url = `https://maps.google.com/?q=${ritual.location.latitude},${ritual.location.longitude}`;
      window.open(url, '_blank');
    }
  };

  const progress = Math.round(((currentStep + 1) / ritual.steps.length) * 100);

  if (showNotes) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ritual Complete!</h2>
            <p className="text-gray-600">How was your experience?</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes & Reflections (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Share your insights, feelings, or any messages you received during the ritual..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleExit}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleComplete}
                disabled={isCompleting}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50"
              >
                {isCompleting ? 'Saving...' : 'Complete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Audio element */}
      {ritual.audioUrl && (
        <audio
          ref={audioRef}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleExit}
            className="flex items-center text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Exit Ritual
          </button>

          <div className="flex items-center gap-4">
            {/* Audio Control */}
            {ritual.audioUrl && (
              <button
                onClick={toggleAudio}
                className="flex items-center px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                {isPlaying ? (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                    </svg>
                    Pause Audio
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8.586 17.414l4.95-4.95a1 1 0 00-1.414-1.414L7.172 16" />
                    </svg>
                    Play Audio
                  </>
                )}
              </button>
            )}

            {/* Location Button */}
            {ritual.location && (
              <button
                onClick={openLocationMap}
                className="flex items-center px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Location
              </button>
            )}
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2">{ritual.title}</h1>
        
        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2 mb-2">
          <div 
            className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-white/80 text-sm">
          Step {currentStep + 1} of {ritual.steps.length} • {progress}% Complete
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          {/* Current Step */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full text-2xl font-bold mb-6">
              {currentStep + 1}
            </div>
            <h2 className="text-xl font-semibold mb-2 text-purple-200">Next Step</h2>
            <p className="text-2xl leading-relaxed mb-8">
              {ritual.steps[currentStep]}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4">
            <button
              onClick={previousStep}
              disabled={currentStep === 0}
              className="flex items-center px-6 py-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <button
              onClick={nextStep}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
            >
              {currentStep === ritual.steps.length - 1 ? (
                <>
                  Complete Step
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </>
              ) : (
                <>
                  Next Step
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* Step Overview */}
          <div className="mt-12 bg-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Ritual Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {ritualSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-3 rounded-lg text-sm transition-all ${
                    index === currentStep
                      ? 'bg-purple-500 text-white'
                      : step.completed
                      ? 'bg-green-500/20 text-green-200'
                      : 'bg-white/10 text-white/60'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mr-2 ${
                      index === currentStep
                        ? 'bg-white text-purple-500'
                        : step.completed
                        ? 'bg-green-500 text-white'
                        : 'bg-white/20'
                    }`}>
                      {step.completed ? '✓' : index + 1}
                    </div>
                    <span className="truncate">Step {index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location Info */}
          {ritual.location && (
            <div className="mt-6 bg-green-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-green-200">Sacred Location Available</h4>
                  <p className="text-green-300 text-sm">{ritual.location.name}</p>
                </div>
                <button
                  onClick={openLocationMap}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  View Map
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="p-6 border-t border-white/20 bg-black/20">
        <div className="flex items-center justify-between">
          <div className="text-white/60 text-sm">
            Take your time • Focus on your intention
          </div>
          
          <button
            onClick={handleExit}
            className="px-4 py-2 text-white/60 hover:text-white transition-colors text-sm"
          >
            End Ritual
          </button>
        </div>
      </div>
    </div>
  );
};

export default RitualRunner;
