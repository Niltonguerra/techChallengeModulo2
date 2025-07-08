import { Injectable, Logger } from '@nestjs/common';

import { QueueInfo } from '../dtos/QueueInfo.dto';
import { RabbitMQQueueManagerService } from './rabbitmqQueueManager.service';

@Injectable()
export class RabbitMQMonitoringService {
  private readonly logger = new Logger(RabbitMQMonitoringService.name);

  constructor(private readonly queueManagerService: RabbitMQQueueManagerService) {}

  // Listar informações de múltiplas filas
  async getMultipleQueuesInfo(queueNames: string[]): Promise<QueueInfo[]> {
    const results: QueueInfo[] = [];

    for (const queueName of queueNames) {
      try {
        const queueInfo = await this.queueManagerService.getQueueInfo(queueName);
        if (queueInfo) {
          results.push(queueInfo);
        }
      } catch (error) {
        this.logger.warn(`Fila '${queueName}' não encontrada ou inacessível`);
      }
    }

    return results;
  }

  // Listar filas padrão do sistema
  async listSystemQueues(): Promise<QueueInfo[]> {
    const systemQueues = [
      'test_queue',
      'email_validation_queue',
      'email_queue',
      'user_queue',
      'notification_queue',
    ];

    return await this.getMultipleQueuesInfo(systemQueues);
  }

  // Obter estatísticas de todas as filas do sistema
  async getAllQueuesStats(): Promise<{
    totalQueues: number;
    totalMessages: number;
    totalConsumers: number;
    queues: QueueInfo[];
  }> {
    try {
      const queues = await this.listSystemQueues();

      const totalMessages = queues.reduce((sum, queue) => sum + queue.messageCount, 0);
      const totalConsumers = queues.reduce((sum, queue) => sum + queue.consumerCount, 0);

      return {
        totalQueues: queues.length,
        totalMessages,
        totalConsumers,
        queues,
      };
    } catch (error) {
      this.logger.error(
        `Erro ao obter estatísticas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      );
      throw error;
    }
  }

  // Remover mensagens de múltiplas filas
  async purgeMultipleQueues(
    queueNames: string[],
  ): Promise<{ [queueName: string]: { success: boolean; messagesDeleted: number } }> {
    const results: { [queueName: string]: { success: boolean; messagesDeleted: number } } = {};

    for (const queueName of queueNames) {
      try {
        results[queueName] = await this.queueManagerService.purgeQueue(queueName);
      } catch (error) {
        results[queueName] = {
          success: false,
          messagesDeleted: 0,
        };
      }
    }

    return results;
  }
}
