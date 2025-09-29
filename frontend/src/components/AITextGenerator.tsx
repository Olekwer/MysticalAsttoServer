import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { getApiUrl } from '../config/api';

const AITextGenerator: React.FC = () => {
  const { token } = useAuthStore();
  const [inputText, setInputText] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState<'general' | 'astrological' | 'energy' | 'mystical'>('mystical');

  const handleGenerate = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(getApiUrl('/ai/generate-text'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          text: inputText,
          type
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate text');
      }

      const data = await response.json();
      setGeneratedText(data.generatedText);
    } catch (error) {
      console.error('Error generating text:', error);
      setGeneratedText('Sorry, I could not generate a response at this time.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMysticalGuidance = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(getApiUrl('/ai/mystical-guidance'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          question: inputText
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get guidance');
      }

      const data = await response.json();
      setGeneratedText(data.guidance);
    } catch (error) {
      console.error('Error getting guidance:', error);
      setGeneratedText('Sorry, I could not provide guidance at this time.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mystical-card p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
          ✨
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Mystical AI Guide</h3>
        <p className="text-white/70">Ask your spiritual questions and receive mystical guidance</p>
      </div>
      
      <div className="mb-4">
        <label className="block text-white/70 text-sm mb-2">Type of guidance:</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as any)}
          className="mystical-input w-full"
        >
          <option value="mystical">Mystical Guidance</option>
          <option value="astrological">Astrological</option>
          <option value="energy">Energy Healing</option>
          <option value="general">General Spiritual</option>
        </select>
      </div>

      <div className="mb-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask your mystical question... (e.g., 'What should I focus on today?' or 'How can I improve my energy?')"
          className="mystical-input w-full h-24 resize-none"
        />
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleGenerate}
          disabled={isLoading || !inputText.trim()}
          className="mystical-button flex-1"
        >
          {isLoading ? 'Generating...' : 'Get AI Response'}
        </button>
        
        <button
          onClick={handleMysticalGuidance}
          disabled={isLoading || !inputText.trim()}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Getting Guidance...' : 'Mystical Guidance'}
        </button>
      </div>

      {generatedText && (
        <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm">
              ✨
            </div>
            <h4 className="text-white font-semibold">Mystical Response:</h4>
          </div>
          <p className="text-white/80 leading-relaxed">{generatedText}</p>
        </div>
      )}

      <div className="mt-4 text-center">
        <p className="text-xs text-white/50">
          Powered by OpenAI • Your questions are processed securely
        </p>
      </div>
    </div>
  );
};

export default AITextGenerator;

