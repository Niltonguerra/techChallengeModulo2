import { Controller, Post, Get, Delete, Body, Param, Query } from '@nestjs/common';
import { RabbitMQQueueManagerService } from '../services/rabbitmqQueueManager.service';

@Controller('rabbitmq/queue')
export class RabbitMQQueueController {
  constructor(private readonly rabbitMQQueueManagerService: RabbitMQQueueManagerService) {}

  @Get(':queueName')
  async getQueueInfo(@Param('queueName') queueName: string) {
    const queueInfo = await this.rabbitMQQueueManagerService.getQueueInfo(queueName);

    if (queueInfo) {
      return { success: true, data: queueInfo };
    } else {
      return { success: false, message: `Fila '${queueName}' não encontrada` };
    }
  }

  @Post(':queueName')
  async createQueue(
    @Param('queueName') queueName: string,
    @Body() options?: { durable?: boolean; exclusive?: boolean; autoDelete?: boolean },
  ) {
    const success = await this.rabbitMQQueueManagerService.createQueue(queueName, options);
    return {
      success,
      message: success
        ? `Fila '${queueName}' criada com sucesso`
        : `Falha ao criar fila '${queueName}'`,
    };
  }

  @Delete(':queueName/messages')
  async purgeQueue(@Param('queueName') queueName: string) {
    const result = await this.rabbitMQQueueManagerService.purgeQueue(queueName);
    return {
      success: result.success,
      message: result.success
        ? `${result.messagesDeleted} mensagens removidas da fila '${queueName}'`
        : `Falha ao purgar fila '${queueName}'`,
      messagesDeleted: result.messagesDeleted,
    };
  }

  @Delete(':queueName')
  async deleteQueue(
    @Param('queueName') queueName: string,
    @Query('ifUnused') ifUnused: boolean = false,
    @Query('ifEmpty') ifEmpty: boolean = false,
  ) {
    const success = await this.rabbitMQQueueManagerService.deleteQueue(queueName, {
      ifUnused: Boolean(ifUnused),
      ifEmpty: Boolean(ifEmpty),
    });

    return {
      success,
      message: success
        ? `Fila '${queueName}' deletada com sucesso`
        : `Falha ao deletar fila '${queueName}'`,
    };
  }

  @Get(':queueName/exists')
  async queueExists(@Param('queueName') queueName: string) {
    const exists = await this.rabbitMQQueueManagerService.queueExists(queueName);
    return {
      success: true,
      exists,
      message: exists ? `Fila '${queueName}' existe` : `Fila '${queueName}' não existe`,
    };
  }
}
