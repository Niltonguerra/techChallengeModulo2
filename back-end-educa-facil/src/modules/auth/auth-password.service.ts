import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@modules/user/entities/user.entity';
import { EmailService } from '../email/service/email.service';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthPasswordService {
  private readonly logger = new Logger(AuthPasswordService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async forgotPassword(dto: ForgotPasswordDto) {
    const { email } = dto;

    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      const token = this.jwtService.sign(
        { email },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '15m',
        },
      );

      this.logger.debug(`[DEV] Token de redefinição gerado para ${email}: ${token}`);

      await this.emailService.sendPasswordResetEmail(user.email, user.name, token);

      this.logger.log(`E-mail de redefinição enviado para ${email}`);
    } else {
      this.logger.warn(`Solicitação de redefinição de senha para e-mail não cadastrado: ${email}`);
    }

    return {
      message:
        'Se um usuário com este e-mail estiver cadastrado, um link de recuperação será enviado.',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { token, newPassword } = dto;

    try {
      const { email } = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await this.userRepository.save(user);

      this.logger.log(`Senha redefinida com sucesso para ${email}`);
      return { message: 'Senha redefinida com sucesso.' };
    } catch (error) {
      this.logger.error('Erro ao redefinir senha', error instanceof Error ? error.stack : error);

      throw new BadRequestException('Token inválido ou expirado.');
    }
  }
}
