import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleDestroy {
  private connection: any;
  private channel: any;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      this.connection = await amqp.connect(
        this.configService.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672'
      );
      this.channel = await this.connection.createChannel();
      console.log('✅ RabbitMQ подключен');
    } catch (error) {
      console.error('❌ Ошибка подключения к RabbitMQ:', error);
    }
  }

  async onModuleDestroy() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
    console.log('❌ RabbitMQ отключен');
  }

  // Заглушка для базовой функциональности
  async publishMessage(queue: string, message: any): Promise<void> {
    if (this.channel) {
      await this.channel.assertQueue(queue, { durable: true });
      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    }
  }
} 