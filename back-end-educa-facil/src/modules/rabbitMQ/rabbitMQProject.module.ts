import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQConnectionService } from './services/rabbitmqConnection.service';
import { RabbitMQQueueManagerService } from './services/rabbitmqQueueManager.service';
import { RabbitMQMonitoringService } from './services/rabbitmqMonitoring.service';
import { RabbitMQPublisherService } from './services/rabbitmqPublisher.service';
import { RabbitMQPublisherController } from './controllers/rabbitmqPublisher.controller';
import { RabbitMQQueueController } from './controllers/rabbitmqQueueManager.controller';
import { RabbitMQMonitoringController } from './controllers/rabbitmqMonitoring.controller';
import { RabbitMQHealthController } from './controllers/rabbitmqHealth.controller';

@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        exchanges: [
          { name: 'test_exchange', type: 'direct', options: { durable: true } },
          { name: 'email_exchange', type: 'direct', options: { durable: true } },
          { name: 'data_exchange', type: 'direct', options: { durable: true } },
        ],
        uri: configService.get<string>('RABBITMQ_URL') || 'amqp://guest:guest@localhost:5672',
        connectionInitOptions: { wait: false, timeout: 10000 },
        enableControllerDiscovery: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    RabbitMQPublisherController,
    RabbitMQQueueController,
    RabbitMQMonitoringController,
    RabbitMQHealthController,
  ],
  providers: [
    RabbitMQConnectionService,
    RabbitMQPublisherService,
    RabbitMQQueueManagerService,
    RabbitMQMonitoringService,
  ],
  exports: [
    RabbitMQConnectionService,
    RabbitMQPublisherService,
    RabbitMQQueueManagerService,
    RabbitMQMonitoringService,
  ],
})
export class RabbitMQProjectModule {}
