import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  constructor(private configService: ConfigService) {}

  // Заглушка для базовой функциональности S3/MinIO
  async uploadFile(file: Buffer, filename: string): Promise<string> {
    // В реальном проекте здесь будет загрузка в S3/MinIO
    console.log(`📁 File ${filename} uploaded (stub)`);
    return `https://storage.example.com/${filename}`;
  }

  async deleteFile(filename: string): Promise<void> {
    // В реальном проекте здесь будет удаление из S3/MinIO
    console.log(`🗑️ File ${filename} deleted (stub)`);
  }
} 