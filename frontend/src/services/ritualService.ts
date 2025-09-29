import { apiService } from './apiService';
import type { Ritual, UserRitual } from '../types/ritual';

export const ritualService = {
  // Get all rituals
  getAllRituals: async (): Promise<Ritual[]> => {
    const response = await apiService.get('/rituals');
    return response.data;
  },

  // Get ritual by ID
  getRitual: async (id: string): Promise<Ritual> => {
    const response = await apiService.get(`/rituals/${id}`);
    return response.data;
  },

  // Get rituals by category
  getRitualsByCategory: async (category: string): Promise<Ritual[]> => {
    const response = await apiService.get(`/rituals/category/${category}`);
    return response.data;
  },

  // Get rituals by difficulty
  getRitualsByDifficulty: async (difficulty: string): Promise<Ritual[]> => {
    const response = await apiService.get(`/rituals/difficulty/${difficulty}`);
    return response.data;
  },

  // Start a ritual
  startRitual: async (ritualId: string): Promise<UserRitual> => {
    const response = await apiService.post(`/rituals/${ritualId}/start`, {});
    return response.data;
  },

  // Update ritual progress
  updateRitualProgress: async (ritualId: string, progress: number): Promise<UserRitual> => {
    const response = await apiService.put(`/rituals/${ritualId}/progress`, { progress });
    return response.data;
  },

  // Complete a ritual
  completeRitual: async (ritualId: string, notes?: string): Promise<UserRitual> => {
    const response = await apiService.post(`/rituals/${ritualId}/complete`, { notes });
    return response.data;
  },

  // Get user's rituals
  getUserRituals: async (): Promise<UserRitual[]> => {
    const response = await apiService.get('/rituals/user/my-rituals');
    return response.data;
  },
};
