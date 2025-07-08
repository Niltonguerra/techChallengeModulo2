import { Controller, Get, Post, Body } from '@nestjs/common';
import { RabbitMQConnectionService } from '../services/rabbitmqConnection.service';

@Controller('rabbitmq/health')
export class RabbitMQHealthController {
  constructor(private readonly rabbitMQConnectionService: RabbitMQConnectionService) {}

  @Get('status')
  getConnectionStatus() {
    return this.rabbitMQConnectionService.getConnectionStatus();
  }

  @Get('connection/check')
  checkConnection() {
    const isAvailable = this.rabbitMQConnectionService.isChannelAvailable();
    return {
      success: true,
      channelAvailable: isAvailable,
      connectionStatus: this.rabbitMQConnectionService.getConnectionStatus(),
    };
  }

  @Post('connection/wait')
  async waitForConnection(@Body() body: { timeoutMs?: number }) {
    try {
      const timeout = body.timeoutMs || 5000;
      const connected = await this.rabbitMQConnectionService.waitForConnection(timeout);
      return {
        success: connected,
        message: connected ? 'Conexão estabelecida' : `Timeout após ${timeout}ms`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  @Get()
  async healthCheck() {
    try {
      const connectionStatus = this.rabbitMQConnectionService.getConnectionStatus();
      const channelAvailable = this.rabbitMQConnectionService.isChannelAvailable();

      const isHealthy = connectionStatus.connected && channelAvailable;

      return {
        success: true,
        healthy: isHealthy,
        details: {
          connection: connectionStatus,
          channelAvailable,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        healthy: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }
}
