import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '../../user/entities/user.entity';
import { EmailService } from '../../email/service/email.service';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';

@Injectable()
export class ForgotPasswordService {
  private readonly logger = new Logger(ForgotPasswordService.name);

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

      this.logger.debug(`Token gerado: ${token}`);
      await this.emailService.sendPasswordResetEmail(user.email, user.name, token);
    }

    return {
      message:
        'Se um usuário com este e-mail estiver cadastrado, um link de recuperação será enviado.',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { token, newPassword } = dto;

    try {
      const { email } = this.jwtService.verify<{ email: string }>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await this.userRepository.save(user);

      return { message: 'Senha redefinida com sucesso.' };
    } catch (error) {
      this.logger.error('Erro ao redefinir senha', error);
      throw new BadRequestException('Token inválido ou expirado.');
    }
  }
}
