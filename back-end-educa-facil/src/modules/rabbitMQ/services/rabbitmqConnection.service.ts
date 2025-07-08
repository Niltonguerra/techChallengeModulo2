import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ChannelWrapper } from 'amqp-connection-manager';

@Injectable()
export class RabbitMQConnectionService {
  private readonly logger = new Logger(RabbitMQConnectionService.name);

  constructor(private readonly amqpConnection: AmqpConnection) {}

  // Verificar status da conexão
  getConnectionStatus(): { connected: boolean; url?: string } {
    const isConnected = this.amqpConnection.managedConnection.isConnected();
    return {
      connected: isConnected,
      url: isConnected ? 'amqp://localhost:5672' : undefined,
    };
  }

  // Obter canal gerenciado com tipagem correta
  getManagedChannel(): ChannelWrapper {
    const channel = this.amqpConnection.managedChannel;
    if (!channel) {
      throw new Error('Canal do RabbitMQ não está disponível');
    }
    return channel;
  }

  // Obter conexão AMQP
  getAmqpConnection(): AmqpConnection {
    return this.amqpConnection;
  }

  // Método auxiliar para verificar se o canal está disponível
  isChannelAvailable(): boolean {
    try {
      const channel = this.amqpConnection.managedChannel;
      return channel !== null && channel !== undefined;
    } catch (error) {
      this.logger.error(
        `Erro ao verificar canal: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      );
      return false;
    }
  }

  // Método para aguardar a conexão estar pronta
  async waitForConnection(timeoutMs: number = 5000): Promise<boolean> {
    return new Promise((resolve) => {
      const startTime = Date.now();

      const checkConnection = () => {
        if (this.amqpConnection.managedConnection.isConnected()) {
          resolve(true);
        } else if (Date.now() - startTime >= timeoutMs) {
          resolve(false);
        } else {
          setTimeout(checkConnection, 100);
        }
      };

      checkConnection();
    });
  }
}
