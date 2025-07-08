import { Injectable, Logger } from '@nestjs/common';
import { RabbitMQConnectionService } from './rabbitmqConnection.service';

@Injectable()
export class RabbitMQPublisherService {
  private readonly logger = new Logger(RabbitMQPublisherService.name);

  constructor(private readonly connectionService: RabbitMQConnectionService) {}

  // Enviar mensagem de teste
  async publishTestMessage(message: string): Promise<boolean> {
    try {
      const testMessage = {
        id: `test-${Date.now()}`,
        message,
        timestamp: Date.now(),
      };

      await this.connectionService
        .getAmqpConnection()
        .publish('test_exchange', 'test.message', testMessage);

      this.logger.log(`Mensagem de teste enviada: ${message}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Erro ao enviar mensagem de teste: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      );
      return false;
    }
  }

  // Enviar mensagem de email
  async publishEmailMessage(emailData: any): Promise<boolean> {
    try {
      await this.connectionService
        .getAmqpConnection()
        .publish('email_exchange', 'email.validation', emailData);

      this.logger.log(`Mensagem de email enviada para: ${emailData.email}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Erro ao enviar mensagem de email: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      );
      return false;
    }
  }

  // Método genérico para publicar qualquer mensagem
  async publishMessage(exchange: string, routingKey: string, message: any): Promise<boolean> {
    try {
      await this.connectionService.getAmqpConnection().publish(exchange, routingKey, message);

      this.logger.log(`Mensagem publicada: ${exchange}/${routingKey}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Erro ao publicar mensagem: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      );
      return false;
    }
  }
}
