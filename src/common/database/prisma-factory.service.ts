import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaFactoryService {
  createClient(): PrismaClient {
    return new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL + '?pgbouncer=true&connection_limit=1',
        },
      },
      // Force new connection each time to avoid prepared statement conflicts
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }

  async withClient<T>(operation: (client: PrismaClient) => Promise<T>): Promise<T> {
    const client = this.createClient();
    try {
      await client.$connect();
      return await operation(client);
    } finally {
      await client.$disconnect();
    }
  }
}
