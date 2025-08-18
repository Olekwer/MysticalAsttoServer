import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create test user
  const hashedPassword = await bcrypt.hash('test123', 10);
  
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: hashedPassword,
      zodiacSign: 'LEO',
      element: 'FIRE',
      timezone: 'Europe/Moscow',
    },
  });

  console.log('✅ Test user created:', testUser.email);

  // Create user profile
  const userProfile = await prisma.userProfile.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      preferences: {
        ritualTypes: ['meditation', 'crystal_work'],
        energyLevels: ['high', 'medium'],
      },
    },
  });

  console.log('✅ User profile created');

  // Create ritual tags
  const ritualTags = await Promise.all([
    prisma.ritualTag.upsert({
      where: { name: 'meditation' },
      update: {},
      create: { name: 'meditation', color: '#8B5CF6' },
    }),
    prisma.ritualTag.upsert({
      where: { name: 'intention-setting' },
      update: {},
      create: { name: 'intention-setting', color: '#10B981' },
    }),
    prisma.ritualTag.upsert({
      where: { name: 'growth' },
      update: {},
      create: { name: 'growth', color: '#F59E0B' },
    }),
    prisma.ritualTag.upsert({
      where: { name: 'action' },
      update: {},
      create: { name: 'action', color: '#EF4444' },
    }),
    prisma.ritualTag.upsert({
      where: { name: 'completion' },
      update: {},
      create: { name: 'completion', color: '#3B82F6' },
    }),
    prisma.ritualTag.upsert({
      where: { name: 'celebration' },
      update: {},
      create: { name: 'celebration', color: '#EC4899' },
    }),
    prisma.ritualTag.upsert({
      where: { name: 'evaluation' },
      update: {},
      create: { name: 'evaluation', color: '#6B7280' },
    }),
    prisma.ritualTag.upsert({
      where: { name: 'release' },
      update: {},
      create: { name: 'release', color: '#8B5CF6' },
    }),
    prisma.ritualTag.upsert({
      where: { name: 'rest' },
      update: {},
      create: { name: 'rest', color: '#10B981' },
    }),
  ]);

  console.log('✅ Ritual tags created');

  // Create rituals
  const rituals = await Promise.all([
    prisma.ritual.upsert({
      where: { id: 'ritual-1' },
      update: {},
      create: {
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
    }),
    prisma.ritual.upsert({
      where: { id: 'ritual-2' },
      update: {},
      create: {
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
    }),
    prisma.ritual.upsert({
      where: { id: 'ritual-3' },
      update: {},
      create: {
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
    }),
    prisma.ritual.upsert({
      where: { id: 'ritual-4' },
      update: {},
      create: {
        id: 'ritual-4',
        title: 'Completion ritual during full moon',
        description: 'Powerful ritual for manifestation and plan realization',
        steps: [
          'Подготовьте алтарь',
          'Зажгите 3 свечи',
          'Произнесите аффирмации',
          'Визуализируйте результат',
          'Благодарите Вселенную',
        ],
        duration: 60,
        category: 'celebration',
        difficulty: 'HARD',
        isPremium: true,
      },
    }),
  ]);

  console.log('✅ Rituals created');

  // Создаем камни
  const stones = await Promise.all([
    prisma.stone.upsert({
      where: { id: 'stone-1' },
      update: {},
      create: {
        id: 'stone-1',
        name: 'Лунный камень',
        description: 'Камень интуиции и женской энергии',
        properties: {
          energy: 'yin',
          chakra: 'crown',
          healing: ['эмоциональный баланс', 'интуиция', 'женственность'],
        },
        zodiacSigns: ['CANCER', 'LIBRA', 'PISCES'],
        elements: ['WATER'],
        isPremium: false,
      },
    }),
    prisma.stone.upsert({
      where: { id: 'stone-2' },
      update: {},
      create: {
        id: 'stone-2',
        name: 'Розовый кварц',
        description: 'Камень любви и исцеления сердца',
        properties: {
          energy: 'yin',
          chakra: 'heart',
          healing: ['любовь', 'самопринятие', 'эмоциональное исцеление'],
        },
        zodiacSigns: ['TAURUS', 'LIBRA', 'PISCES'],
        elements: ['WATER', 'EARTH'],
        isPremium: false,
      },
    }),
    prisma.stone.upsert({
      where: { id: 'stone-3' },
      update: {},
      create: {
        id: 'stone-3',
        name: 'Тигровый глаз',
        description: 'Камень защиты и силы воли',
        properties: {
          energy: 'yang',
          chakra: 'solar_plexus',
          healing: ['защита', 'сила воли', 'уверенность'],
        },
        zodiacSigns: ['ARIES', 'LEO', 'SAGITTARIUS'],
        elements: ['FIRE'],
        isPremium: false,
      },
    }),
    prisma.stone.upsert({
      where: { id: 'stone-4' },
      update: {},
      create: {
        id: 'stone-4',
        name: 'Цитрин',
        description: 'Камень изобилия и успеха',
        properties: {
          energy: 'yang',
          chakra: 'solar_plexus',
          healing: ['изобилие', 'успех', 'мотивация'],
        },
        zodiacSigns: ['LEO', 'SAGITTARIUS', 'ARIES'],
        elements: ['FIRE'],
        isPremium: true,
      },
    }),
  ]);

  console.log('✅ Stones created');

  // Создаем рецепты настоев
  const teaRecipes = await Promise.all([
    prisma.teaRecipe.upsert({
      where: { id: 'tea-1' },
      update: {},
      create: {
        id: 'tea-1',
        name: 'Успокаивающий настой для новолуния',
        description: 'Травяной сбор для медитации и планирования',
        ingredients: {
          chamomile: '1 ч.л.',
          lavender: '1/2 ч.л.',
          mint: '1/2 ч.л.',
          honey: 'по вкусу',
        },
        instructions: 'Залейте травы кипятком, настаивайте 10 минут, добавьте мед',
        benefits: ['успокоение', 'ясность ума', 'глубокий сон'],
        zodiacSigns: ['CANCER', 'PISCES'],
        elements: ['WATER'],
        isPremium: false,
      },
    }),
    prisma.teaRecipe.upsert({
      where: { id: 'tea-2' },
      update: {},
      create: {
        id: 'tea-2',
        name: 'Энергетический настой для активных действий',
        description: 'Бодрящий сбор для высокой активности',
        ingredients: {
          ginseng: '1 ч.л.',
          ginger: '1/2 ч.л.',
          lemon: '1 долька',
          honey: 'по вкусу',
        },
        instructions: 'Залейте корень женьшеня кипятком, добавьте имбирь и лимон',
        benefits: ['энергия', 'концентрация', 'выносливость'],
        zodiacSigns: ['ARIES', 'LEO', 'SAGITTARIUS'],
        elements: ['FIRE'],
        isPremium: false,
      },
    }),
    prisma.teaRecipe.upsert({
      where: { id: 'tea-3' },
      update: {},
      create: {
        id: 'tea-3',
        name: 'Балансирующий настой для равновесия',
        description: 'Гармонизирующий сбор для баланса энергий',
        ingredients: {
          rose: '1 ч.л.',
          jasmine: '1/2 ч.л.',
          chamomile: '1/2 ч.л.',
          honey: 'по вкусу',
        },
        instructions: 'Смешайте цветы, залейте кипятком, настаивайте 15 минут',
        benefits: ['гармония', 'любовь', 'эмоциональный баланс'],
        zodiacSigns: ['LIBRA', 'TAURUS'],
        elements: ['AIR', 'EARTH'],
        isPremium: true,
      },
    }),
  ]);

  console.log('✅ Tincture recipes created');

  console.log('🎉 Database successfully seeded!');
  console.log('🔑 Test user credentials:');
  console.log('   Email: test@example.com');
  console.log('   Password: test123');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка заполнения базы данных:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 