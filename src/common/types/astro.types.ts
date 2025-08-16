export interface MoonPhaseData {
  phase: string;
  illumination: number;
  moonrise: Date;
  moonset: Date;
}

export interface AstroInfluences {
  moonPhase: string;
  energy: string;
  activities: string[];
  crystals: string[];
}

export interface EnergyScoreFactors {
  moonPhase: string;
  zodiacSign: string;
  element: string;
  timezone: string;
  calculatedAt: Date;
}

export interface RitualRecommendation {
  id: string;
  title: string;
  description: string;
  steps: string[];
  duration: number;
  category: string;
  difficulty: string;
  isPremium: boolean;
}

export interface StoneRecommendation {
  id: string;
  name: string;
  description: string;
  properties: {
    energy: string;
    chakra: string;
    healing: string[];
  };
  zodiacSigns: string[];
  elements: string[];
  isPremium: boolean;
}

export interface TeaRecipeRecommendation {
  id: string;
  name: string;
  description: string;
  ingredients: Record<string, string>;
  instructions: string;
  benefits: string[];
  zodiacSigns: string[];
  elements: string[];
  isPremium: boolean;
}

export interface AstroPath {
  theme: string;
  focus: string;
  actions: string[];
  duration: string;
}

export interface DailyRecommendations {
  ritual: RitualRecommendation;
  stone: StoneRecommendation;
  tea: TeaRecipeRecommendation;
  energyTip: string;
  astroPath: AstroPath;
}

export interface UserAstroProfile {
  zodiacSign: string;
  element: string;
  birthDate: Date;
  birthTime: string;
  birthPlace: string;
  timezone: string;
} 