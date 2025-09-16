import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const powerPlaces = [
  // Europe
  { name: 'Stonehenge, UK', description: 'Ancient stone circle with mystical energy', latitude: 51.1789, longitude: -1.8262, type: 'ancient', energyLevel: 9 },
  { name: 'Glastonbury Tor, UK', description: 'Sacred hill with spiritual significance', latitude: 51.1444, longitude: -2.7036, type: 'spiritual', energyLevel: 8 },
  { name: 'Mount Olympus, Greece', description: 'Home of the ancient Greek gods', latitude: 40.0853, longitude: 22.3556, type: 'mythological', energyLevel: 10 },
  { name: 'Temple of Delphi, Greece', description: 'Oracle of Apollo and center of ancient wisdom', latitude: 38.4823, longitude: 22.4942, type: 'oracle', energyLevel: 9 },
  { name: 'Lake Błędno, Poland', description: 'Mystical lake with healing properties', latitude: 50.2649, longitude: 19.0238, type: 'natural', energyLevel: 7 },
  { name: 'Crystal Cave, Iceland', description: 'Natural crystal formations with energy', latitude: 64.9631, longitude: -19.0208, type: 'natural', energyLevel: 8 },
  { name: 'Salisbury Plain, UK', description: 'Ancient landscape with ley lines', latitude: 51.1789, longitude: -1.8262, type: 'ley_line', energyLevel: 7 },
  { name: 'Avebury, UK', description: 'Largest stone circle in Europe', latitude: 51.4286, longitude: -1.8542, type: 'ancient', energyLevel: 8 },
  { name: 'Carnac, France', description: 'Mysterious standing stones', latitude: 47.5850, longitude: -3.0775, type: 'ancient', energyLevel: 7 },
  { name: 'Newgrange, Ireland', description: 'Ancient passage tomb aligned with winter solstice', latitude: 53.6948, longitude: -6.4755, type: 'ancient', energyLevel: 9 },

  // North America
  { name: 'Sedona Vortex, USA', description: 'Energy vortex with healing properties', latitude: 34.8697, longitude: -111.7609, type: 'vortex', energyLevel: 9 },
  { name: 'Mount Shasta, California', description: 'Sacred mountain with spiritual energy', latitude: 41.4096, longitude: -122.3125, type: 'mountain', energyLevel: 8 },
  { name: 'Chaco Canyon, New Mexico', description: 'Ancient Puebloan ceremonial center', latitude: 36.0614, longitude: -107.9661, type: 'ancient', energyLevel: 8 },
  { name: 'Cahokia Mounds, Illinois', description: 'Ancient Native American city', latitude: 38.6564, longitude: -90.0594, type: 'ancient', energyLevel: 7 },
  { name: 'Mesa Verde, Colorado', description: 'Ancient cliff dwellings', latitude: 37.1853, longitude: -108.4619, type: 'ancient', energyLevel: 7 },
  { name: 'Yellowstone National Park, USA', description: 'Geothermal energy and natural beauty', latitude: 44.4280, longitude: -110.5885, type: 'natural', energyLevel: 8 },
  { name: 'Grand Canyon, Arizona', description: 'Sacred landscape with deep spiritual energy', latitude: 36.1069, longitude: -112.1129, type: 'natural', energyLevel: 9 },
  { name: 'Niagara Falls, USA/Canada', description: 'Powerful water energy', latitude: 43.0962, longitude: -79.0377, type: 'water', energyLevel: 8 },
  { name: 'Mount Rainier, Washington', description: 'Sacred mountain with spiritual significance', latitude: 46.8523, longitude: -121.7603, type: 'mountain', energyLevel: 8 },
  { name: 'Crater Lake, Oregon', description: 'Sacred lake in volcanic caldera', latitude: 42.8684, longitude: -122.1685, type: 'water', energyLevel: 7 },

  // South America
  { name: 'Machu Picchu, Peru', description: 'Ancient Incan city with spiritual energy', latitude: -13.1631, longitude: -72.5449, type: 'ancient', energyLevel: 10 },
  { name: 'Nazca Lines, Peru', description: 'Mysterious geoglyphs in the desert', latitude: -14.7289, longitude: -75.1281, type: 'mysterious', energyLevel: 8 },
  { name: 'Easter Island, Chile', description: 'Mysterious moai statues', latitude: -27.1127, longitude: -109.3497, type: 'mysterious', energyLevel: 8 },
  { name: 'Salar de Uyuni, Bolivia', description: 'World largest salt flat with mirror effect', latitude: -20.1338, longitude: -67.4891, type: 'natural', energyLevel: 7 },
  { name: 'Iguazu Falls, Argentina/Brazil', description: 'Powerful waterfall energy', latitude: -25.6953, longitude: -54.4367, type: 'water', energyLevel: 8 },
  { name: 'Atacama Desert, Chile', description: 'Driest desert with stargazing energy', latitude: -24.5000, longitude: -69.2500, type: 'desert', energyLevel: 6 },
  { name: 'Amazon Rainforest, Brazil', description: 'Lung of the Earth with natural energy', latitude: -3.4653, longitude: -62.2159, type: 'forest', energyLevel: 8 },
  { name: 'Titicaca Lake, Peru/Bolivia', description: 'Sacred lake at high altitude', latitude: -15.7975, longitude: -69.4291, type: 'water', energyLevel: 9 },
  { name: 'Torres del Paine, Chile', description: 'Dramatic mountain landscape', latitude: -50.9423, longitude: -73.4068, type: 'mountain', energyLevel: 8 },
  { name: 'Galapagos Islands, Ecuador', description: 'Unique ecosystem with natural energy', latitude: -0.7893, longitude: -91.0544, type: 'island', energyLevel: 7 },

  // Asia
  { name: 'Mount Fuji, Japan', description: 'Sacred volcano with spiritual significance', latitude: 35.3606, longitude: 138.7274, type: 'mountain', energyLevel: 9 },
  { name: 'Angkor Wat, Cambodia', description: 'Ancient temple complex with spiritual energy', latitude: 13.4125, longitude: 103.8670, type: 'temple', energyLevel: 9 },
  { name: 'Bali, Indonesia', description: 'Island of gods with spiritual energy', latitude: -8.3405, longitude: 115.1889, type: 'island', energyLevel: 8 },
  { name: 'Himalayas, Nepal', description: 'Roof of the world with spiritual energy', latitude: 28.0000, longitude: 84.0000, type: 'mountain', energyLevel: 10 },
  { name: 'Ganges River, India', description: 'Sacred river with spiritual significance', latitude: 25.3176, longitude: 83.0059, type: 'water', energyLevel: 9 },
  { name: 'Borobudur, Indonesia', description: 'Ancient Buddhist temple', latitude: -7.6079, longitude: 110.2038, type: 'temple', energyLevel: 8 },
  { name: 'Petra, Jordan', description: 'Ancient city carved in rock', latitude: 30.3285, longitude: 35.4444, type: 'ancient', energyLevel: 8 },
  { name: 'Great Wall of China', description: 'Ancient defensive structure', latitude: 40.4319, longitude: 116.5704, type: 'ancient', energyLevel: 7 },
  { name: 'Taj Mahal, India', description: 'Monument of love with spiritual energy', latitude: 27.1751, longitude: 78.0421, type: 'monument', energyLevel: 8 },
  { name: 'Mount Kailash, Tibet', description: 'Sacred mountain in Tibetan Buddhism', latitude: 31.0668, longitude: 81.3124, type: 'mountain', energyLevel: 10 },

  // Africa
  { name: 'Pyramids of Giza, Egypt', description: 'Ancient pyramids with mystical energy', latitude: 29.9792, longitude: 31.1342, type: 'ancient', energyLevel: 10 },
  { name: 'Sphinx, Egypt', description: 'Mysterious guardian with ancient wisdom', latitude: 29.9753, longitude: 31.1376, type: 'ancient', energyLevel: 9 },
  { name: 'Victoria Falls, Zambia/Zimbabwe', description: 'Powerful waterfall energy', latitude: -17.9243, longitude: 25.8572, type: 'water', energyLevel: 8 },
  { name: 'Mount Kilimanjaro, Tanzania', description: 'Africa highest peak with spiritual energy', latitude: -3.0674, longitude: 37.3556, type: 'mountain', energyLevel: 8 },
  { name: 'Serengeti, Tanzania', description: 'Wildlife migration with natural energy', latitude: -2.1530, longitude: 34.6857, type: 'wildlife', energyLevel: 7 },
  { name: 'Sahara Desert, Morocco', description: 'Vast desert with meditative energy', latitude: 25.0000, longitude: 0.0000, type: 'desert', energyLevel: 6 },
  { name: 'Nile River, Egypt', description: 'Life-giving river with ancient energy', latitude: 26.8206, longitude: 30.8025, type: 'water', energyLevel: 8 },
  { name: 'Table Mountain, South Africa', description: 'Flat-topped mountain with spiritual energy', latitude: -33.9628, longitude: 18.4096, type: 'mountain', energyLevel: 7 },
  { name: 'Okavango Delta, Botswana', description: 'Unique wetland ecosystem', latitude: -19.2576, longitude: 22.9000, type: 'wetland', energyLevel: 7 },
  { name: 'Atlas Mountains, Morocco', description: 'Mountain range with natural energy', latitude: 31.5000, longitude: -7.5000, type: 'mountain', energyLevel: 7 },

  // Australia & Oceania
  { name: 'Uluru, Australia', description: 'Sacred rock formation with spiritual energy', latitude: -25.3444, longitude: 131.0369, type: 'rock', energyLevel: 9 },
  { name: 'Great Barrier Reef, Australia', description: 'Underwater ecosystem with natural energy', latitude: -18.2871, longitude: 147.6992, type: 'reef', energyLevel: 7 },
  { name: 'Kakadu National Park, Australia', description: 'Ancient rock art and natural beauty', latitude: -12.4634, longitude: 132.8456, type: 'ancient', energyLevel: 7 },
  { name: 'Blue Mountains, Australia', description: 'Mountain range with natural energy', latitude: -33.7000, longitude: 150.3000, type: 'mountain', energyLevel: 6 },
  { name: 'Milford Sound, New Zealand', description: 'Fiord with dramatic natural beauty', latitude: -44.6414, longitude: 167.8971, type: 'fiord', energyLevel: 8 },
  { name: 'Tongariro National Park, New Zealand', description: 'Volcanic landscape with spiritual energy', latitude: -39.2000, longitude: 175.5833, type: 'volcanic', energyLevel: 8 },
  { name: 'Fiji Islands', description: 'Tropical paradise with natural energy', latitude: -16.5788, longitude: 179.4144, type: 'island', energyLevel: 6 },
  { name: 'Tahiti, French Polynesia', description: 'Tropical island with natural beauty', latitude: -17.6797, longitude: -149.4068, type: 'island', energyLevel: 6 },
  { name: 'Hawaii Volcanoes National Park, USA', description: 'Active volcanoes with natural energy', latitude: 19.4194, longitude: -155.2881, type: 'volcanic', energyLevel: 8 },
  { name: 'Bora Bora, French Polynesia', description: 'Tropical paradise with natural energy', latitude: -16.5004, longitude: -151.7415, type: 'island', energyLevel: 6 }
];

async function seedPowerPlaces() {
  console.log('🌍 Seeding power places...');

  for (const place of powerPlaces) {
    await prisma.powerPlace.create({
      data: place,
    });
  }

  console.log(`✅ Seeded ${powerPlaces.length} power places`);
}

async function main() {
  try {
    await seedPowerPlaces();
  } catch (error) {
    console.error('❌ Error seeding power places:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
