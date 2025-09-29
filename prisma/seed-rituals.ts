import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const rituals = [
  {
    id: 'ritual-water-cleansing',
    title: 'Water Cleansing Ritual',
    description: 'A purifying ritual using the cleansing power of water to release negative energy',
    steps: [
      'Fill a bowl with fresh spring water',
      'Add a pinch of sea salt',
      'Light a white candle beside the bowl',
      'Dip your hands in the water and visualize cleansing',
      'Splash water on your face while saying "I release all negativity"',
      'Pour the remaining water outside to return it to nature'
    ],
    duration: 15,
    category: 'cleansing',
    difficulty: 'EASY',
    audioUrl: null,
    locationId: null,
    isPremium: false
  },
  {
    id: 'ritual-moon-manifestation',
    title: 'Full Moon Manifestation Ritual',
    description: 'Harness the powerful energy of the full moon to manifest your deepest desires',
    steps: [
      'Find a quiet outdoor space under the full moon',
      'Create a circle with white stones or salt',
      'Light three silver candles in the center',
      'Write your intentions on parchment paper',
      'Hold the paper to your heart and speak your desires aloud',
      'Burn the paper safely and watch the smoke carry your intentions skyward',
      'Thank the moon and extinguish the candles'
    ],
    duration: 30,
    category: 'manifestation',
    difficulty: 'MEDIUM',
    audioUrl: null,
    locationId: null,
    isPremium: false
  },
  {
    id: 'ritual-crystal-charging',
    title: 'Crystal Energy Charging Ritual',
    description: 'Activate and charge your crystals with focused intention and natural elements',
    steps: [
      'Gather your crystals and cleanse them with sage smoke',
      'Arrange them in a sacred geometry pattern',
      'Place a clear quartz in the center as an amplifier',
      'Set your hands over the crystals and close your eyes',
      'Visualize white light flowing from your palms into the stones',
      'State your intention for each crystal three times',
      'Leave them overnight under starlight to complete the charging'
    ],
    duration: 20,
    category: 'energy_work',
    difficulty: 'MEDIUM',
    audioUrl: null,
    locationId: null,
    isPremium: false
  },
  {
    id: 'ritual-morning-gratitude',
    title: 'Morning Gratitude Sunrise Ritual',
    description: 'Start your day with appreciation and positive energy aligned with the rising sun',
    steps: [
      'Wake before sunrise and go outside',
      'Face the eastern horizon',
      'Take five deep breaths of fresh morning air',
      'As the sun rises, speak three things you are grateful for',
      'Stretch your arms toward the sun and feel its warmth',
      'Set one positive intention for the day ahead',
      'Carry this gratitude energy with you throughout the day'
    ],
    duration: 10,
    category: 'daily_practice',
    difficulty: 'EASY',
    audioUrl: null,
    locationId: null,
    isPremium: false
  },
  {
    id: 'ritual-ancestor-connection',
    title: 'Ancestral Wisdom Connection Ritual',
    description: 'Connect with the wisdom of your ancestors for guidance and protection',
    steps: [
      'Create an altar with photos of deceased family members',
      'Light a purple candle for spiritual connection',
      'Burn frankincense or myrrh incense',
      'Sit quietly and call upon your ancestors by name',
      'Ask for their guidance on a specific question',
      'Listen with your heart for their wisdom',
      'Thank them and leave an offering of water or flowers',
      'Journal any insights you received'
    ],
    duration: 25,
    category: 'spiritual_connection',
    difficulty: 'MEDIUM',
    audioUrl: null,
    locationId: null,
    isPremium: true
  },
  {
    id: 'ritual-chakra-balancing',
    title: 'Seven Chakra Balancing Ritual',
    description: 'Align and balance all seven chakras using color visualization and sound',
    steps: [
      'Lie down comfortably with spine straight',
      'Place corresponding colored stones on each chakra point',
      'Start at the root chakra - visualize red light spinning',
      'Chant "LAM" while focusing on the base of your spine',
      'Move up to sacral chakra - orange light, chant "VAM"',
      'Continue through all chakras: solar plexus (yellow, "RAM"), heart (green, "YAM"), throat (blue, "HAM"), third eye (indigo, "OM"), crown (violet, "SILENCE")',
      'End with full-body white light visualization',
      'Rest in this balanced state for 5 minutes'
    ],
    duration: 35,
    category: 'energy_work',
    difficulty: 'HARD',
    audioUrl: null,
    locationId: null,
    isPremium: true
  },
  {
    id: 'ritual-protection-shield',
    title: 'Psychic Protection Shield Ritual',
    description: 'Create a protective energy barrier around yourself for spiritual defense',
    steps: [
      'Stand in the center of your room',
      'Light black candles in the four corners',
      'Hold a piece of black tourmaline or obsidian',
      'Visualize a bright white light surrounding your entire body',
      'See this light forming an impenetrable shield',
      'Say "I am protected by divine light, no harm can reach me"',
      'Seal the protection by drawing a pentagram in the air',
      'Carry the protective stone with you'
    ],
    duration: 15,
    category: 'protection',
    difficulty: 'MEDIUM',
    audioUrl: null,
    locationId: null,
    isPremium: false
  },
  {
    id: 'ritual-love-attraction',
    title: 'Heart Opening Love Attraction Ritual',
    description: 'Open your heart chakra to attract loving relationships into your life',
    steps: [
      'Create a sacred space with pink and red candles',
      'Place rose quartz stones around you in a heart shape',
      'Burn rose or jasmine incense',
      'Hold your hands over your heart chakra',
      'Visualize green healing light filling your heart',
      'Speak affirmations of self-love and worthiness',
      'Write a letter to your future beloved describing your ideal relationship',
      'Keep the letter under your pillow for seven nights',
      'Release attachment to outcomes and trust in divine timing'
    ],
    duration: 30,
    category: 'love_magic',
    difficulty: 'MEDIUM',
    audioUrl: null,
    locationId: null,
    isPremium: true
  },
  {
    id: 'ritual-abundance-prosperity',
    title: 'Golden Abundance Prosperity Ritual',
    description: 'Attract financial abundance and prosperity using the power of intention and gratitude',
    steps: [
      'Gather coins, bills, and symbols of wealth',
      'Light a gold or green candle',
      'Create a prosperity altar with citrine and pyrite crystals',
      'Hold money in your hands and feel grateful for current abundance',
      'Visualize golden light flowing into your financial life',
      'Speak: "I am a magnet for prosperity and abundance"',
      'Place the money on the altar overnight',
      'Carry a citrine stone in your wallet as a prosperity charm'
    ],
    duration: 20,
    category: 'prosperity',
    difficulty: 'EASY',
    audioUrl: null,
    locationId: null,
    isPremium: false
  },
  {
    id: 'ritual-shadow-work',
    title: 'Shadow Integration Healing Ritual',
    description: 'Confront and integrate your shadow aspects for psychological healing and wholeness',
    steps: [
      'Prepare a dark, private space with a black candle',
      'Sit before a mirror in candlelight',
      'Look deeply into your own eyes',
      'Ask: "What part of myself am I hiding from?"',
      'Allow difficult emotions or thoughts to surface',
      'Acknowledge these shadow aspects without judgment',
      'Speak compassionately to your reflection',
      'Write down insights in a shadow work journal',
      'End by affirming your complete self-acceptance'
    ],
    duration: 40,
    category: 'healing',
    difficulty: 'HARD',
    audioUrl: null,
    locationId: null,
    isPremium: true
  },
  {
    id: 'ritual-elemental-balance',
    title: 'Four Elements Balance Ritual',
    description: 'Harmonize the four classical elements within yourself for complete balance',
    steps: [
      'Gather representations of each element: candle (fire), bowl of water (water), feather (air), stone (earth)',
      'Create a circle and place each element in its cardinal direction',
      'Start in the East with Air - wave the feather and breathe deeply',
      'Move to South with Fire - light the candle and feel its warmth',
      'Continue to West with Water - dip fingers in bowl and anoint your forehead',
      'End in North with Earth - hold the stone and feel grounded',
      'Stand in center and feel all elements balanced within you',
      'Thank each element for its gifts'
    ],
    duration: 25,
    category: 'balance',
    difficulty: 'MEDIUM',
    audioUrl: null,
    locationId: null,
    isPremium: false
  },
  {
    id: 'ritual-dream-enhancement',
    title: 'Lucid Dream Enhancement Ritual',
    description: 'Prepare your mind for vivid dreams and potential lucid dreaming experiences',
    steps: [
      'One hour before bed, dim all lights',
      'Place amethyst and moonstone under your pillow',
      'Burn lavender incense in your bedroom',
      'Write your dream intention in a dream journal',
      'Perform gentle stretching and breathing exercises',
      'As you lie down, repeat: "I will remember my dreams clearly"',
      'Visualize yourself becoming aware within a dream',
      'Keep journal and pen beside your bed for morning recall'
    ],
    duration: 30,
    category: 'dream_work',
    difficulty: 'MEDIUM',
    audioUrl: null,
    locationId: null,
    isPremium: true
  },
  {
    id: 'ritual-inner-child-healing',
    title: 'Inner Child Healing Ritual',
    description: 'Heal childhood wounds and reconnect with your authentic, joyful inner child',
    steps: [
      'Gather childhood photos and favorite childhood items',
      'Create a safe, comfortable space with soft lighting',
      'Light a pink candle for unconditional love',
      'Hold your childhood photo and speak to your younger self',
      'Apologize for any self-criticism or neglect',
      'Promise to protect and nurture your inner child',
      'Do something playful your child-self would enjoy',
      'Write a loving letter from your adult self to your inner child',
      'End with a self-embrace and words of encouragement'
    ],
    duration: 45,
    category: 'healing',
    difficulty: 'HARD',
    audioUrl: null,
    locationId: null,
    isPremium: true
  },
  {
    id: 'ritual-seasonal-transition',
    title: 'Seasonal Transition Ritual',
    description: 'Honor the changing seasons and align your energy with natural cycles',
    steps: [
      'Go outside and observe signs of the changing season',
      'Collect natural items representing the new season',
      'Create a seasonal altar with these items',
      'Light a candle in the color of the season',
      'Reflect on what you want to release from the previous season',
      'Set intentions aligned with the energy of the new season',
      'Bury or burn symbols of what you\'re releasing',
      'Welcome the new seasonal energy into your life'
    ],
    duration: 30,
    category: 'seasonal',
    difficulty: 'EASY',
    audioUrl: null,
    locationId: null,
    isPremium: false
  },
  {
    id: 'ritual-cord-cutting',
    title: 'Energetic Cord Cutting Ritual',
    description: 'Release unhealthy energetic connections and reclaim your personal power',
    steps: [
      'Light a white candle for purification',
      'Visualize golden cords connecting you to others',
      'Identify any cords that feel draining or unhealthy',
      'Hold a piece of black obsidian for protection',
      'Visualize cutting these negative cords with a sword of light',
      'See the cut ends healing with golden light',
      'Affirm: "I release all that no longer serves my highest good"',
      'Send love and forgiveness to all parties involved',
      'Seal your energy field with protective white light'
    ],
    duration: 25,
    category: 'healing',
    difficulty: 'MEDIUM',
    audioUrl: null,
    locationId: null,
    isPremium: false
  },
  {
    id: 'ritual-third-eye-opening',
    title: 'Third Eye Activation Ritual',
    description: 'Awaken and strengthen your psychic abilities and intuitive sight',
    steps: [
      'Sit in meditation posture facing north',
      'Place an amethyst crystal on your forehead',
      'Light purple candles around you',
      'Close your eyes and focus on the space between your eyebrows',
      'Visualize an indigo light growing brighter at your third eye',
      'Chant "OM" 108 times while maintaining focus',
      'Ask your higher self to activate your psychic vision',
      'Sit quietly and observe any visions or insights',
      'Journal your experience and practice regularly'
    ],
    duration: 35,
    category: 'psychic_development',
    difficulty: 'HARD',
    audioUrl: null,
    locationId: null,
    isPremium: true
  },
  {
    id: 'ritual-house-blessing',
    title: 'Sacred House Blessing Ritual',
    description: 'Cleanse and bless your home with positive energy and protection',
    steps: [
      'Open all windows and doors to allow energy flow',
      'Light white sage or palo santo',
      'Start at the front door and move clockwise through each room',
      'Wave the smoke into corners, closets, and doorways',
      'Sprinkle blessed salt at each entrance',
      'Place protective crystals in the four corners of your home',
      'End at the heart of your home (usually kitchen or living room)',
      'Speak a blessing: "May this home be filled with love, peace, and protection"',
      'Ring a bell three times to seal the blessing'
    ],
    duration: 40,
    category: 'home_blessing',
    difficulty: 'MEDIUM',
    audioUrl: null,
    locationId: null,
    isPremium: false
  },
  {
    id: 'ritual-past-life-exploration',
    title: 'Past Life Regression Ritual',
    description: 'Journey into past lives to understand current life patterns and karma',
    steps: [
      'Create a sacred space with soft music and dim lighting',
      'Lie down comfortably with a clear quartz on your crown chakra',
      'Begin with deep relaxation breathing',
      'Visualize walking down a long staircase',
      'At the bottom, see a door marked with an ancient symbol',
      'Step through the door into a past life scene',
      'Observe without judgment - who are you, where are you?',
      'Ask what lesson this life has for your current incarnation',
      'Thank the past self and return through the door',
      'Journal all insights and recurring themes'
    ],
    duration: 50,
    category: 'past_life',
    difficulty: 'HARD',
    audioUrl: null,
    locationId: null,
    isPremium: true
  },
  {
    id: 'ritual-new-moon-intentions',
    title: 'New Moon Intention Setting Ritual',
    description: 'Plant seeds of intention during the powerful new moon energy for manifestation',
    steps: [
      'Gather on the night of the new moon',
      'Create a sacred space with black candles',
      'Write your intentions for the lunar cycle on new paper',
      'Speak each intention aloud with conviction',
      'Visualize your intentions already manifested',
      'Bury the paper in earth or place under a plant',
      'Light incense as an offering to the moon',
      'Commit to taking action toward your goals',
      'Track progress throughout the lunar cycle'
    ],
    duration: 20,
    category: 'manifestation',
    difficulty: 'EASY',
    audioUrl: null,
    locationId: null,
    isPremium: false
  },
  {
    id: 'ritual-soul-retrieval',
    title: 'Soul Fragment Retrieval Ritual',
    description: 'Reclaim lost parts of your soul and restore your spiritual wholeness',
    steps: [
      'Create a healing sanctuary with soft lighting',
      'Burn copal or frankincense for spiritual protection',
      'Lie down with healing crystals on your body',
      'Enter a meditative trance state',
      'Journey to the moment you felt soul loss (trauma, heartbreak)',
      'Find the lost soul fragment and speak to it with love',
      'Invite this part of yourself to return home to your heart',
      'Visualize the soul piece integrating back into your being',
      'Feel yourself becoming more whole and complete',
      'Seal the integration with self-love and acceptance'
    ],
    duration: 60,
    category: 'soul_healing',
    difficulty: 'HARD',
    audioUrl: null,
    locationId: null,
    isPremium: true
  }
];

async function seedRituals() {
  console.log('🌱 Starting ritual seeding...');

  // First, create ritual tags that will be used
  const ritualTags = await Promise.all([
    prisma.ritualTag.upsert({
      where: { name: 'cleansing' },
      update: {},
      create: { name: 'cleansing', color: '#3B82F6' },
    }),
    prisma.ritualTag.upsert({
      where: { name: 'manifestation' },
      update: {},
      create: { name: 'manifestation', color: '#8B5CF6' },
    }),
    prisma.ritualTag.upsert({
      where: { name: 'energy_work' },
      update: {},
      create: { name: 'energy_work', color: '#10B981' },
    }),
    prisma.ritualTag.upsert({
      where: { name: 'daily_practice' },
      update: {},
      create: { name: 'daily_practice', color: '#F59E0B' },
    }),
    prisma.ritualTag.upsert({
      where: { name: 'spiritual_connection' },
      update: {},
      create: { name: 'spiritual_connection', color: '#8B5CF6' },
    }),
    prisma.ritualTag.upsert({
      where: { name: 'protection' },
      update: {},
      create: { name: 'protection', color: '#EF4444' },
    }),
    prisma.ritualTag.upsert({
      where: { name: 'love_magic' },
      update: {},
      create: { name: 'love_magic', color: '#EC4899' },
    }),
    prisma.ritualTag.upsert({
      where: { name: 'prosperity' },
      update: {},
      create: { name: 'prosperity', color: '#10B981' },
    }),
    prisma.ritualTag.upsert({
      where: { name: 'healing' },
      update: {},
      create: { name: 'healing', color: '#06B6D4' },
    }),
    prisma.ritualTag.upsert({
      where: { name: 'balance' },
      update: {},
      create: { name: 'balance', color: '#84CC16' },
    }),
    prisma.ritualTag.upsert({
      where: { name: 'dream_work' },
      update: {},
      create: { name: 'dream_work', color: '#6366F1' },
    }),
    prisma.ritualTag.upsert({
      where: { name: 'seasonal' },
      update: {},
      create: { name: 'seasonal', color: '#F97316' },
    }),
    prisma.ritualTag.upsert({
      where: { name: 'psychic_development' },
      update: {},
      create: { name: 'psychic_development', color: '#7C3AED' },
    }),
    prisma.ritualTag.upsert({
      where: { name: 'home_blessing' },
      update: {},
      create: { name: 'home_blessing', color: '#059669' },
    }),
    prisma.ritualTag.upsert({
      where: { name: 'past_life' },
      update: {},
      create: { name: 'past_life', color: '#9333EA' },
    }),
    prisma.ritualTag.upsert({
      where: { name: 'soul_healing' },
      update: {},
      create: { name: 'soul_healing', color: '#0891B2' },
    }),
  ]);

  console.log('✅ Ritual tags created');

  // Create rituals
  const createdRituals = await Promise.all(
    rituals.map(ritual =>
      prisma.ritual.upsert({
        where: { id: ritual.id },
        update: {},
        create: ritual,
      })
    )
  );

  console.log(`✅ Created ${createdRituals.length} rituals`);

  // Connect rituals to their corresponding tags
  const tagConnections = [
    { ritualId: 'ritual-water-cleansing', tagName: 'cleansing' },
    { ritualId: 'ritual-moon-manifestation', tagName: 'manifestation' },
    { ritualId: 'ritual-crystal-charging', tagName: 'energy_work' },
    { ritualId: 'ritual-morning-gratitude', tagName: 'daily_practice' },
    { ritualId: 'ritual-ancestor-connection', tagName: 'spiritual_connection' },
    { ritualId: 'ritual-chakra-balancing', tagName: 'energy_work' },
    { ritualId: 'ritual-protection-shield', tagName: 'protection' },
    { ritualId: 'ritual-love-attraction', tagName: 'love_magic' },
    { ritualId: 'ritual-abundance-prosperity', tagName: 'prosperity' },
    { ritualId: 'ritual-shadow-work', tagName: 'healing' },
    { ritualId: 'ritual-elemental-balance', tagName: 'balance' },
    { ritualId: 'ritual-dream-enhancement', tagName: 'dream_work' },
    { ritualId: 'ritual-inner-child-healing', tagName: 'healing' },
    { ritualId: 'ritual-seasonal-transition', tagName: 'seasonal' },
    { ritualId: 'ritual-cord-cutting', tagName: 'healing' },
    { ritualId: 'ritual-third-eye-opening', tagName: 'psychic_development' },
    { ritualId: 'ritual-house-blessing', tagName: 'home_blessing' },
    { ritualId: 'ritual-past-life-exploration', tagName: 'past_life' },
    { ritualId: 'ritual-new-moon-intentions', tagName: 'manifestation' },
    { ritualId: 'ritual-soul-retrieval', tagName: 'soul_healing' },
  ];

  // Connect rituals to tags
  for (const connection of tagConnections) {
    const ritual = await prisma.ritual.findUnique({
      where: { id: connection.ritualId }
    });
    const tag = await prisma.ritualTag.findUnique({
      where: { name: connection.tagName }
    });

    if (ritual && tag) {
      await prisma.ritualToRitualTag.upsert({
        where: {
          A_B: {
            A: ritual.id,
            B: tag.id
          }
        },
        update: {},
        create: {
          A: ritual.id,
          B: tag.id
        }
      });
    }
  }

  console.log('✅ Ritual-tag connections created');
  console.log('🎉 Ritual seeding completed successfully!');
}

export default seedRituals;

if (require.main === module) {
  seedRituals()
    .catch((e) => {
      console.error('❌ Error seeding rituals:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
