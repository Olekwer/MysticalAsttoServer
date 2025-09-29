import { create } from 'zustand';
import { getApiUrl, API_CONFIG } from '../config/api';

interface AstroData {
  id: string;
  type: 'natal' | 'transit' | 'synastry';
  data: any;
  createdAt: string;
}

interface AstroState {
  natalChart: any | null;
  currentTransits: any[];
  synastryData: any | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchNatalChart: (birthDate: string, birthTime: string, birthPlace: string) => Promise<void>;
  fetchTransits: (date: string) => Promise<void>;
  fetchSynastry: (person1: any, person2: any) => Promise<void>;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAstroStore = create<AstroState>((set, get) => ({
  natalChart: null,
  currentTransits: [],
  synastryData: null,
  isLoading: false,
  error: null,

  fetchNatalChart: async (birthDate: string, birthTime: string, birthPlace: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ASTRO.NATAL_CHART), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          birthDate,
          birthTime,
          birthPlace,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch natal chart');
      }

      const data = await response.json();
      set({
        natalChart: data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch natal chart',
        isLoading: false,
      });
    }
  },

  fetchTransits: async (date: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.ASTRO.TRANSITS}?date=${date}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transits');
      }

      const data = await response.json();
      set({
        currentTransits: data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch transits',
        isLoading: false,
      });
    }
  },

  fetchSynastry: async (person1: any, person2: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ASTRO.SYNASTRY), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          person1,
          person2,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch synastry');
      }

      const data = await response.json();
      set({
        synastryData: data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch synastry',
        isLoading: false,
      });
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
