import { Injectable, Logger } from '@nestjs/common';

import { QueueInfo } from '../dtos/QueueInfo.dto';
import { RabbitMQConnectionService } from './rabbitmqConnection.service';

@Injectable()
export class RabbitMQQueueManagerService {
  private readonly logger = new Logger(RabbitMQQueueManagerService.name);

  constructor(private readonly connectionService: RabbitMQConnectionService) {}

  // Obter informações de uma fila específica
  async getQueueInfo(queueName: string): Promise<QueueInfo | null> {
    try {
      const channel = this.connectionService.getManagedChannel();
      const queueInfo = await channel.checkQueue(queueName);

      const result: QueueInfo = {
        name: queueName,
        messageCount: queueInfo.messageCount,
        consumerCount: queueInfo.consumerCount,
        durable: true,
      };

      this.logger.log(`Informações da fila '${queueName}': ${queueInfo.messageCount} mensagens`);
      return result;
    } catch (error) {
      this.logger.error(
        `Erro ao obter informações da fila '${queueName}': ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      );
      return null;
    }
  }

  // Criar uma nova fila
  async createQueue(
    queueName: string,
    options?: { durable?: boolean; exclusive?: boolean; autoDelete?: boolean },
  ): Promise<boolean> {
    try {
      const channel = this.connectionService.getManagedChannel();

      await channel.assertQueue(queueName, {
        durable: options?.durable ?? true,
        exclusive: options?.exclusive ?? false,
        autoDelete: options?.autoDelete ?? false,
      });

      this.logger.log(`Fila '${queueName}' criada com sucesso`);
      return true;
    } catch (error) {
      this.logger.error(
        `Erro ao criar fila '${queueName}': ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      );
      return false;
    }
  }

  // Purgar uma fila
  async purgeQueue(queueName: string): Promise<{ success: boolean; messagesDeleted: number }> {
    try {
      const channel = this.connectionService.getManagedChannel();
      const result = await channel.purgeQueue(queueName);

      this.logger.log(`Fila '${queueName}' purgada. ${result.messageCount} mensagens removidas`);

      return {
        success: true,
        messagesDeleted: result.messageCount,
      };
    } catch (error) {
      this.logger.error(
        `Erro ao purgar fila '${queueName}': ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      );
      return {
        success: false,
        messagesDeleted: 0,
      };
    }
  }

  // Deletar uma fila
  async deleteQueue(
    queueName: string,
    options?: { ifUnused?: boolean; ifEmpty?: boolean },
  ): Promise<boolean> {
    try {
      const channel = this.connectionService.getManagedChannel();

      await channel.deleteQueue(queueName, {
        ifUnused: options?.ifUnused || false,
        ifEmpty: options?.ifEmpty || false,
      });

      this.logger.log(`Fila '${queueName}' deletada com sucesso`);
      return true;
    } catch (error) {
      this.logger.error(
        `Erro ao deletar fila '${queueName}': ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      );
      return false;
    }
  }

  // Verificar se uma fila existe
  async queueExists(queueName: string): Promise<boolean> {
    try {
      const queueInfo = await this.getQueueInfo(queueName);
      return queueInfo !== null;
    } catch (error) {
      return false;
    }
  }
}
