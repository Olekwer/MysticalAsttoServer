import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Безопасность
  app.use(helmet());
  app.use(compression());

  // CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  // Валидация
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger документация
  const config = new DocumentBuilder()
    .setTitle('Mystical Astro API')
    .setDescription('API для астрологического сервиса с персональными рекомендациями')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.APP_PORT || 3010;
  await app.listen(port);
  
  console.log(`🚀 Приложение запущено на порту ${port}`);
  console.log(`📚 Swagger документация доступна по адресу: http://localhost:${port}/api`);
}

bootstrap(); 