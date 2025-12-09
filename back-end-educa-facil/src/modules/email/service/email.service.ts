import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SendEmailDTO } from '../dtos/sendemail.dto';
// import * as nodemailer from 'nodemailer';
// import { Transporter } from 'nodemailer';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { Resend } from 'resend';
import { redefinicao_senha } from '../templates/redefinicao_senha';
import { confirmacao_conta } from '../templates/confirmacao_conta';

@Injectable()
export class EmailService {
  private resend: Resend;
  private readonly logger = new Logger(EmailService.name);
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
  }
  // constructor(
  //   private readonly jwtService: JwtService,
  //   private configService: ConfigService,
  // ) {
  //   this.transporter = nodemailer.createTransport({
  //     host: 'smtp.gmail.com',
  //     port: 587,
  //     secure: false,
  //     auth: {
  //       user: this.configService.get<string>('EMAIL_USER'),
  //       pass: this.configService.get<string>('EMAIL_PASSWORD'),
  //     },
  //     tls: {
  //       rejectUnauthorized: false,
  //     },
  //   });
  // }
  // private transporter: Transporter;

  async enviaVerificacaoEmail(email: string, url: string): Promise<number> {
    try {
      const urlServer =
        this.configService.get<string>('AMBIENTE') === 'PROD'
          ? this.configService.get<string>('URL_SERVER_PROD')
          : this.configService.get<string>('URL_SERVER_DEV');

      const tittleMessage = 'Confirmação de e-mail - EducaFácil';
      const linkVerification = `${urlServer}${url}?token=${email}`;
      const bodyMessage = confirmacao_conta(linkVerification);

      const mailOptions: SendEmailDTO = {
        from: this.configService.get<string>('EMAIL_USER', ''),
        to: email,
        subject: tittleMessage,
        html: bodyMessage,
      };

      await this.resend.emails.send(mailOptions);
      return 200;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : systemMessage.ReturnMessage.errorSendEmail;
      this.logger.error(`Erro ao enviar e-mail de verificação: ${errorMessage}`);
      return 400;
    }
  }

  async sendPasswordResetEmail(email: string, nome: string, token: string): Promise<number> {
    try {
      const frontendUrl =
        this.configService.get<string>('AMBIENTE') === 'PROD'
          ? this.configService.get<string>('FRONTEND_URL_PROD')
          : this.configService.get<string>('FRONTEND_URL_LOCAL');

      const link = `${frontendUrl}/reset-password?token=${token}`;

      const mailOptions: SendEmailDTO = {
        from: this.configService.get<string>('EMAIL_USER', ''),
        to: email,
        subject: 'Recuperação de senha - EducaFácil',
        html: redefinicao_senha(link, nome),
      };

      await this.resend.emails.send(mailOptions);
      this.logger.log(`E-mail de recuperação enviado para ${email}`);
      return 200;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar e-mail';
      this.logger.error(`Erro ao enviar e-mail de recuperação: ${errorMessage}`);
      return 400;
    }
  }
}
