import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SendEmailDTO } from '../dtos/sendemail.dto';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { systemMessage } from '@config/i18n/pt/systemMessage';

@Injectable()
export class EmailService {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }
  private transporter: Transporter;
  private readonly logger = new Logger(EmailService.name);

  EnviaVerificacaoEmail(email: string, url: string): number {
    try {
      const urlServer =
        this.configService.get<string>('AMBIENTE') === 'PROD'
          ? this.configService.get<string>('URL_SERVER_PROD')
          : this.configService.get<string>('URL_SERVER_DEV');

      const tituloMensagem = 'Verificação de e-mail do aplicativo MoveSmart';
      const corpoMensagem = `Clique no link a seguir para verificar seu e-mail: ${urlServer}${url}?token=${email}`;

      const mailOptions: SendEmailDTO = {
        from: this.configService.get<string>('EMAIL_USER', ''),
        to: email,
        subject: tituloMensagem,
        text: corpoMensagem,
      };

      void this.transporter.sendMail(mailOptions);
      return 200;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : systemMessage.ReturnMessage.errorSendEmail;
      this.logger.error(`Erro ao enviar e-mail de verificação: ${errorMessage}`);
      return 400;
    }
  }
}
