import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategyUser } from './strategies/jwt.strategy';
import { RolesGuardProfessor } from './guards/roles-professor.guard';
import { JwtAuthGuardUser } from './guards/jwt-auth-user.guard';
import { HashPasswordPipe } from './pipe/passwordEncryption.pipe';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesGuardStudent } from './guards/roles-student.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/user/entities/user.entity';
import { EmailModule } from '@modules/email/email.module';
import { AuthPasswordService } from './auth-password.service';
import { AuthPasswordController } from './auth-password.controller';

@Module({
  imports: [
    ConfigModule, // Importar o ConfigModule
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
    EmailModule,
  ],
  providers: [
    JwtStrategyUser,
    RolesGuardStudent,
    RolesGuardProfessor,
    JwtAuthGuardUser,
    HashPasswordPipe,
    AuthPasswordService,
  ],
  controllers: [AuthPasswordController],
  exports: [
    JwtStrategyUser,
    RolesGuardStudent,
    RolesGuardProfessor,
    JwtAuthGuardUser,
    JwtModule,
    HashPasswordPipe,
  ],
})
export class AuthModule {}
