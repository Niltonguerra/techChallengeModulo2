import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';
import { ReturnMessageDTO } from './dtos/returnMessage.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('testeEnviarEmail')
  EnviaVerificacao(): ReturnMessageDTO {
    const response = this.emailService.EnviaVerificacaoEmail(
      'niltondg.39@gmail.com',
      'user/CadastraUsuario',
    );
    return {
      statusCode: response,
      message: 'E-mail enviado com sucesso',
    };
  }
}
