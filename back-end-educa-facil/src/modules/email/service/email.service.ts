import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SendEmailDTO } from '../dtos/sendemail.dto';
// import * as nodemailer from 'nodemailer';
// import { Transporter } from 'nodemailer';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { Resend } from 'resend';

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

      const tituloMensagem = 'Verificação de e-mail do aplicativo MoveSmart';
      const corpoMensagem = `Clique no link a seguir para verificar seu e-mail: ${urlServer}${url}?token=${email}`;

      const mailOptions: SendEmailDTO = {
        from: this.configService.get<string>('EMAIL_USER', ''),
        to: email,
        subject: tituloMensagem,
        html: corpoMensagem,
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
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <p>Olá, <b>${nome}</b>!</p>
            <p>Você solicitou a redefinição da sua senha.</p>
            <p>Clique no link abaixo para criar uma nova senha:</p>
            <p style="word-break: break-all;">
              <a href="${link}" target="_blank" style="color: #1a73e8; text-decoration: underline;">
                ${link}
              </a>
            </p>
            <p>Este link é válido por 15 minutos.</p>
          </div>
        `,
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
