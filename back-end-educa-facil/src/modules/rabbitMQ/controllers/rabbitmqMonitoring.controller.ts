import { Controller, Post, Get, Delete, Body } from '@nestjs/common';
import { RabbitMQMonitoringService } from '../services/rabbitmqMonitoring.service';

@Controller('rabbitmq/monitoring')
export class RabbitMQMonitoringController {
  constructor(private readonly rabbitMQMonitoringService: RabbitMQMonitoringService) {}

  @Get('queues')
  async listSystemQueues() {
    try {
      const queues = await this.rabbitMQMonitoringService.listSystemQueues();
      return { success: true, data: queues };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  @Post('queues/info')
  async getMultipleQueuesInfo(@Body() body: { queueNames: string[] }) {
    try {
      const queues = await this.rabbitMQMonitoringService.getMultipleQueuesInfo(body.queueNames);
      return { success: true, data: queues };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  @Get('statistics')
  async getAllQueuesStats() {
    try {
      const stats = await this.rabbitMQMonitoringService.getAllQueuesStats();
      return { success: true, data: stats };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  @Delete('queues/messages')
  async purgeMultipleQueues(@Body() body: { queueNames: string[] }) {
    const results = await this.rabbitMQMonitoringService.purgeMultipleQueues(body.queueNames);
    return { success: true, data: results };
  }
}
