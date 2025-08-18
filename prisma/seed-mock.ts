// Mock seed script - работает без реальной базы данных
// Используется для разработки и тестирования

console.log('🌱 Starting mock database seeding...');

// Mock ritual tags
const ritualTags = [
  { name: 'meditation', color: '#8B5CF6' },
  { name: 'intention-setting', color: '#10B981' },
  { name: 'growth', color: '#F59E0B' },
  { name: 'action', color: '#EF4444' },
  { name: 'completion', color: '#3B82F6' },
  { name: 'celebration', color: '#EC4899' },
  { name: 'evaluation', color: '#6B7280' },
  { name: 'release', color: '#8B5CF6' },
  { name: 'rest', color: '#10B981' },
];

console.log('✅ Mock ritual tags created:', ritualTags.length);

// Mock rituals
const rituals = [
  {
    id: 'ritual-1',
    title: 'New Moon Morning Meditation',
    description: 'Peaceful meditation for setting intentions during new moon',
    steps: [
      'Find a quiet place',
      'Sit comfortably, close your eyes',
      'Take 3 deep breaths',
      'Imagine your goals for the month',
      'Write down 3 main intentions',
    ],
    duration: 15,
    category: 'meditation',
    difficulty: 'EASY',
    isPremium: false,
  },
  {
    id: 'ritual-2',
    title: 'Growth ritual during waxing moon',
    description: 'Active ritual for skill development and learning',
    steps: [
      'Prepare study materials',
      'Light a candle',
      'Read new information',
      'Practice new skill for 20 minutes',
      'Write down progress',
    ],
    duration: 30,
    category: 'growth',
    difficulty: 'MEDIUM',
    isPremium: false,
  },
  {
    id: 'ritual-3',
    title: 'Action ritual during first quarter',
    description: 'Energetic ritual for decision making and actions',
    steps: [
      'Define the main task of the day',
      'Do warm-up',
      'Complete the task with full dedication',
      'Celebrate success',
    ],
    duration: 45,
    category: 'action',
    difficulty: 'MEDIUM',
    isPremium: false,
  },
  {
    id: 'ritual-4',
    title: 'Completion ritual during full moon',
    description: 'Powerful ritual for manifestation and plan realization',
    steps: [
      'Prepare altar',
      'Light 3 candles',
      'Say affirmations',
      'Visualize the result',
      'Thank the Universe',
    ],
    duration: 60,
    category: 'celebration',
    difficulty: 'HARD',
    isPremium: true,
  },
];

console.log('✅ Mock rituals created:', rituals.length);

// Mock stones
const stones = [
  {
    id: 'stone-1',
    name: 'Moonstone',
    description: 'Stone of intuition and feminine energy',
    properties: {
      energy: 'yin',
      chakra: 'crown',
      healing: ['emotional balance', 'intuition', 'femininity'],
    },
    zodiacSigns: ['CANCER', 'LIBRA', 'PISCES'],
    elements: ['WATER'],
    isPremium: false,
  },
  {
    id: 'stone-2',
    name: 'Rose Quartz',
    description: 'Stone of love and heart healing',
    properties: {
      energy: 'yin',
      chakra: 'heart',
      healing: ['love', 'self-acceptance', 'emotional healing'],
    },
    zodiacSigns: ['TAURUS', 'LIBRA', 'PISCES'],
    elements: ['WATER', 'EARTH'],
    isPremium: false,
  },
  {
    id: 'stone-3',
    name: 'Tiger Eye',
    description: 'Stone of protection and willpower',
    properties: {
      energy: 'yang',
      chakra: 'solar_plexus',
      healing: ['protection', 'willpower', 'confidence'],
    },
    zodiacSigns: ['ARIES', 'LEO', 'SAGITTARIUS'],
    elements: ['FIRE'],
    isPremium: false,
  },
  {
    id: 'stone-4',
    name: 'Citrine',
    description: 'Stone of abundance and success',
    properties: {
      energy: 'yang',
      chakra: 'solar_plexus',
      healing: ['abundance', 'success', 'motivation'],
    },
    zodiacSigns: ['LEO', 'SAGITTARIUS', 'ARIES'],
    elements: ['FIRE'],
    isPremium: true,
  },
];

console.log('✅ Mock stones created:', stones.length);

// Mock tea recipes
const teaRecipes = [
  {
    id: 'tea-1',
    name: 'Calming infusion for new moon',
    description: 'Herbal blend for meditation and planning',
    ingredients: {
      chamomile: '1 tsp',
      lavender: '1/2 tsp',
      mint: '1/2 tsp',
      honey: 'to taste',
    },
    instructions: 'Pour boiling water over herbs, steep for 10 minutes, add honey',
    benefits: ['calming', 'mental clarity', 'deep sleep'],
    zodiacSigns: ['CANCER', 'PISCES'],
    elements: ['WATER'],
    isPremium: false,
  },
  {
    id: 'tea-2',
    name: 'Energy infusion for active actions',
    description: 'Invigorating blend for high activity',
    ingredients: {
      ginseng: '1 tsp',
      ginger: '1/2 tsp',
      lemon: '1 slice',
      honey: 'to taste',
    },
    instructions: 'Pour boiling water over ginseng root, add ginger and lemon',
    benefits: ['energy', 'concentration', 'endurance'],
    zodiacSigns: ['ARIES', 'LEO', 'SAGITTARIUS'],
    elements: ['FIRE'],
    isPremium: false,
  },
  {
    id: 'tea-3',
    name: 'Balancing infusion for equilibrium',
    description: 'Harmonizing blend for energy balance',
    ingredients: {
      rose: '1 tsp',
      jasmine: '1/2 tsp',
      chamomile: '1/2 tsp',
      honey: 'to taste',
    },
    instructions: 'Mix flowers, pour boiling water, steep for 15 minutes',
    benefits: ['harmony', 'love', 'emotional balance'],
    zodiacSigns: ['LIBRA', 'TAURUS'],
    elements: ['AIR', 'EARTH'],
    isPremium: true,
  },
];

console.log('✅ Mock tea recipes created:', teaRecipes.length);

// Mock users
const users = [
  {
    id: 'user-1',
    email: 'test@example.com',
    zodiacSign: 'LEO',
    element: 'FIRE',
    timezone: 'Europe/Moscow',
    preferences: {
      ritualTypes: ['meditation', 'crystal_work'],
      energyLevels: ['high', 'medium'],
    },
  },
  {
    id: 'user-2',
    email: 'demo@example.com',
    zodiacSign: 'PISCES',
    element: 'WATER',
    timezone: 'America/New_York',
    preferences: {
      ritualTypes: ['intention-setting', 'healing'],
      energyLevels: ['low', 'medium'],
    },
  },
];

console.log('✅ Mock users created:', users.length);

// Mock energy scores
const energyScores = [
  {
    userId: 'user-1',
    date: new Date().toISOString().split('T')[0],
    score: 75,
    factors: {
      moonPhase: 'waxing_crescent',
      zodiacSign: 'LEO',
      element: 'FIRE',
      timezone: 'Europe/Moscow',
      calculatedAt: new Date().toISOString(),
    },
  },
  {
    userId: 'user-2',
    date: new Date().toISOString().split('T')[0],
    score: 60,
    factors: {
      moonPhase: 'waxing_crescent',
      zodiacSign: 'PISCES',
      element: 'WATER',
      timezone: 'America/New_York',
      calculatedAt: new Date().toISOString(),
    },
  },
];

console.log('✅ Mock energy scores created:', energyScores.length);

// Mock recommendations
const recommendations = [
  {
    userId: 'user-1',
    date: new Date().toISOString().split('T')[0],
    ritual: rituals[0],
    stone: stones[2], // Tiger Eye
    tea: teaRecipes[1], // Energy infusion
    energyTip: 'High energy day - perfect for action and growth rituals',
    astroPath: 'Fire element alignment - focus on passion and creativity',
  },
  {
    userId: 'user-2',
    date: new Date().toISOString().split('T')[0],
    ritual: rituals[1], // Growth ritual
    stone: stones[0], // Moonstone
    tea: teaRecipes[0], // Calming infusion
    energyTip: 'Medium energy - balance activity with rest',
    astroPath: 'Water element flow - embrace intuition and emotions',
  },
];

console.log('✅ Mock recommendations created:', recommendations.length);

// Summary
console.log('\n📊 Mock Data Summary:');
console.log(`- Ritual Tags: ${ritualTags.length}`);
console.log(`- Rituals: ${rituals.length}`);
console.log(`- Stones: ${stones.length}`);
console.log(`- Tea Recipes: ${teaRecipes.length}`);
console.log(`- Users: ${users.length}`);
console.log(`- Energy Scores: ${energyScores.length}`);
console.log(`- Recommendations: ${recommendations.length}`);

console.log('\n🎉 Mock database successfully seeded!');
console.log('💡 This data is stored in memory and will be reset on restart.');
console.log('🔧 To use real database, run: npm run db:seed (requires PostgreSQL)');

// Export mock data for use in other parts of the application
export const mockData = {
  ritualTags,
  rituals,
  stones,
  teaRecipes,
  users,
  energyScores,
  recommendations,
};
