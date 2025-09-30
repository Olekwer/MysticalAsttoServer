import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';

@Injectable()
export class DatabaseInitService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseInitService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.initializeSchema();
  }

  private async initializeSchema() {
    try {
      this.logger.log('🚀 Initializing database schema...');

      // Check if users table exists
      const userTableExists = await this.prisma.$queryRaw`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'users'
        );
      `;

      if ((userTableExists as any)[0]?.exists) {
        this.logger.log('✅ Database schema already exists');
        return;
      }

      this.logger.log('📊 Creating database schema...');

      // Create enums
      await this.createEnums();
      
      // Create tables
      await this.createTables();

      this.logger.log('✅ Database schema created successfully!');
      
    } catch (error) {
      this.logger.error('❌ Database schema initialization failed:', error.message);
      // Don't throw - let app continue
    }
  }

  private async createEnums() {
    const enums = [
      { name: 'ZodiacSign', values: ['ARIES', 'TAURUS', 'GEMINI', 'CANCER', 'LEO', 'VIRGO', 'LIBRA', 'SCORPIO', 'SAGITTARIUS', 'CAPRICORN', 'AQUARIUS', 'PISCES'] },
      { name: 'Element', values: ['FIRE', 'EARTH', 'AIR', 'WATER'] },
      { name: 'RitualStatus', values: ['ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'] },
      { name: 'MoonPhaseType', values: ['NEW_MOON', 'WAXING_CRESCENT', 'FIRST_QUARTER', 'WAXING_GIBBOUS', 'FULL_MOON', 'WANING_GIBBOUS', 'LAST_QUARTER', 'WANING_CRESCENT'] },
      { name: 'RecommendationType', values: ['RITUAL_OF_DAY', 'STONE_OF_DAY', 'TEA_RECIPE', 'ENERGY_TIP', 'ASTROLOGICAL_PATH'] },
      { name: 'SubscriptionStatus', values: ['ACTIVE', 'CANCELLED', 'EXPIRED', 'PENDING'] }
    ];

    for (const enumDef of enums) {
      try {
        // Check if enum exists
        const enumExists = await this.prisma.$queryRaw`
          SELECT EXISTS (
            SELECT 1 FROM pg_type 
            WHERE typname = ${enumDef.name.toLowerCase()}
          );
        `;

        if (!(enumExists as any)[0]?.exists) {
          const enumValues = enumDef.values.map(v => `'${v}'`).join(', ');
          const query = `CREATE TYPE "${enumDef.name}" AS ENUM (${enumValues})`;
          await this.prisma.$executeRawUnsafe(query);
          this.logger.log(`✅ Created enum: ${enumDef.name}`);
        } else {
          this.logger.log(`📋 Enum already exists: ${enumDef.name}`);
        }
      } catch (error) {
        this.logger.error(`❌ Failed to create enum ${enumDef.name}:`, error.message);
        // Don't throw - continue with other enums
      }
    }
  }

  private async createTables() {
    const tables = [
      {
        name: 'users',
        query: `CREATE TABLE IF NOT EXISTS "users" (
          "id" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "password" TEXT,
          "firstName" TEXT,
          "lastName" TEXT,
          "birthDate" TIMESTAMP(3),
          "birthTime" TEXT,
          "birthPlace" TEXT,
          "zodiacSign" "ZodiacSign",
          "element" "Element",
          "timezone" TEXT NOT NULL DEFAULT 'UTC',
          "language" TEXT NOT NULL DEFAULT 'ru',
          "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
          "isPremium" BOOLEAN NOT NULL DEFAULT false,
          "magicLinkToken" TEXT,
          "magicLinkExpires" TIMESTAMP(3),
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "users_pkey" PRIMARY KEY ("id")
        )`
      },
      {
        name: 'rituals',
        query: `CREATE TABLE IF NOT EXISTS "rituals" (
          "id" TEXT NOT NULL,
          "title" TEXT NOT NULL,
          "description" TEXT,
          "steps" JSONB NOT NULL,
          "duration" INTEGER NOT NULL,
          "category" TEXT NOT NULL,
          "difficulty" TEXT NOT NULL,
          "isPremium" BOOLEAN NOT NULL DEFAULT false,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "rituals_pkey" PRIMARY KEY ("id")
        )`
      },
      {
        name: 'stones',
        query: `CREATE TABLE IF NOT EXISTS "stones" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "description" TEXT,
          "properties" JSONB NOT NULL,
          "zodiacSigns" "ZodiacSign"[],
          "elements" "Element"[],
          "isPremium" BOOLEAN NOT NULL DEFAULT false,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "stones_pkey" PRIMARY KEY ("id")
        )`
      },
      {
        name: 'tea_recipes',
        query: `CREATE TABLE IF NOT EXISTS "tea_recipes" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "description" TEXT,
          "ingredients" JSONB NOT NULL,
          "instructions" TEXT NOT NULL,
          "benefits" TEXT[],
          "zodiacSigns" "ZodiacSign"[],
          "elements" "Element"[],
          "isPremium" BOOLEAN NOT NULL DEFAULT false,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "tea_recipes_pkey" PRIMARY KEY ("id")
        )`
      }
    ];

    for (const table of tables) {
      try {
        await this.prisma.$executeRawUnsafe(table.query);
        this.logger.log(`✅ Created table: ${table.name}`);
      } catch (error) {
        this.logger.error(`❌ Failed to create table ${table.name}:`, error.message);
        // Don't throw - continue with other tables
      }
    }

    // Create indexes
    try {
      await this.prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email")`);
      this.logger.log('✅ Created indexes');
    } catch (error) {
      this.logger.error('❌ Failed to create indexes:', error.message);
    }
  }
}
