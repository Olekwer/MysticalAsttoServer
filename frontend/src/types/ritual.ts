export interface RitualTag {
  id: string;
  name: string;
  color: string;
}

export interface PowerPlace {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  type: string;
  energyLevel: number;
}

export interface Ritual {
  id: string;
  title: string;
  description?: string;
  steps: string[];
  duration: number;
  category: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  audioUrl?: string;
  locationId?: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
  RitualToRitualTag: {
    ritual_tags: RitualTag;
  }[];
  location?: PowerPlace;
}

export interface UserRitual {
  id: string;
  userId: string;
  ritualId: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  progress: number;
  startedAt: string;
  completedAt?: string;
  notes?: string;
  ritual: Ritual;
}

export interface RitualStep {
  id: number;
  text: string;
  completed: boolean;
}
