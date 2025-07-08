import { Controller, Post, Body } from '@nestjs/common';
import { RabbitMQPublisherService } from '../services/rabbitmqPublisher.service';

@Controller('rabbitmq/publisher')
export class RabbitMQPublisherController {
  constructor(private readonly rabbitMQPublisherService: RabbitMQPublisherService) {}

  @Post('test-message')
  async sendTestMessage(@Body() body: { message: string }) {
    const success = await this.rabbitMQPublisherService.publishTestMessage(body.message);
    return {
      success,
      message: success ? 'Mensagem de teste enviada com sucesso' : 'Falha ao enviar mensagem',
    };
  }

  @Post('email-message')
  async sendEmailMessage(@Body() emailData: any) {
    const success = await this.rabbitMQPublisherService.publishEmailMessage(emailData);
    return {
      success,
      message: success ? 'Mensagem de email enviada com sucesso' : 'Falha ao enviar email',
    };
  }

  @Post('publish')
  async publishMessage(@Body() body: { exchange: string; routingKey: string; message: any }) {
    const success = await this.rabbitMQPublisherService.publishMessage(
      body.exchange,
      body.routingKey,
      body.message,
    );
    return {
      success,
      message: success ? 'Mensagem publicada com sucesso' : 'Falha ao publicar mensagem',
    };
  }
}
