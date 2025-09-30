import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitMQService implements OnModuleDestroy {
  private readonly isRabbitMQAvailable: boolean;

  constructor(private configService: ConfigService) {
    // Проверяем доступность RabbitMQ
    this.isRabbitMQAvailable = false; // Временно отключаем RabbitMQ

    if (this.isRabbitMQAvailable) {
      console.log('✅ RabbitMQ connected');
    } else {
      console.log('⚠️ RabbitMQ not available, using mock service');
    }
  }

  async publishMessage(queue: string, message: any): Promise<void> {
    try {
      if (this.isRabbitMQAvailable) {
        // Здесь был бы реальный RabbitMQ код
        console.log(`📤 Message published to queue ${queue}:`, message);
      } else {
        console.log(`📤 Mock: Message published to queue ${queue}:`, message);
      }
    } catch (error) {
      console.error('❌ Error publishing message:', error);
    }
  }

  async consumeMessage(queue: string, callback: (message: any) => void): Promise<void> {
    try {
      if (this.isRabbitMQAvailable) {
        // Здесь был бы реальный RabbitMQ код
        console.log(`Consumer registered for queue ${callback}`);
      } else {
        console.log(`Mock: Consumer registered for queue ${queue}`);
      }
    } catch (error) {
      console.error('Error consuming message:', error);
    }
  }

  async onModuleDestroy() {
    if (this.isRabbitMQAvailable) {
      // Здесь был бы реальный RabbitMQ код
    }
    console.log('❌ RabbitMQ disconnected');
  }
}
