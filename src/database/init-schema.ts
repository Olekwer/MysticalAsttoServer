import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';
import { Client } from 'pg';

@Injectable()
export class DatabaseInitService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseInitService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.initializeSchema();
  }

  private async initializeSchema() {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      this.logger.error('❌ DATABASE_URL is not set. Skipping schema initialization.');
      return;
    }

    const client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });

    try {
      this.logger.log('🚀 Initializing database schema...');
      await client.connect();
      this.logger.log('🔌 Connected to database');

      // Create enums first
      await this.createEnums(client);
      
      // Create tables
      await this.createTables(client);

      this.logger.log('✅ Database schema initialized successfully!');
      
    } catch (error) {
      this.logger.error('❌ Database schema initialization failed:', error.message);
      // Don't throw - let app continue
    } finally {
      await client.end();
      this.logger.log('🔌 Database connection closed');
    }
  }

  private async createEnums(client: Client) {
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
        const enumValues = enumDef.values.map(v => `'${v}'`).join(', ');
        const query = `DO $$ BEGIN 
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = '${enumDef.name.toLowerCase()}') THEN
            CREATE TYPE "${enumDef.name}" AS ENUM (${enumValues});
          END IF;
        END $$;`;
        
        await client.query(query);
        this.logger.log(`✅ Ensured enum exists: ${enumDef.name}`);
      } catch (error) {
        this.logger.error(`❌ Failed to create enum ${enumDef.name}:`, error.message);
        // Don't throw - continue with other enums
      }
    }
  }

  private async createTables(client: Client) {
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
        await client.query(table.query);
        this.logger.log(`✅ Created table: ${table.name}`);
      } catch (error) {
        this.logger.error(`❌ Failed to create table ${table.name}:`, error.message);
        // Don't throw - continue with other tables
      }
    }

    // Create indexes
    try {
      await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email")`);
      this.logger.log('✅ Created indexes');
    } catch (error) {
      this.logger.error('❌ Failed to create indexes:', error.message);
    }
  }
}
