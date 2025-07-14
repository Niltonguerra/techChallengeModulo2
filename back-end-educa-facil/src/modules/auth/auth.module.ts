import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategyUser } from './strategies/jwt.strategy';
import { RolesGuardProfessor } from './guards/roles-professor.guard';
import { JwtAuthGuardUser } from './guards/jwt-auth-user.guard';
import { HashPasswordPipe } from './pipe/passwordEncryption.pipe';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesGuardStudent } from './guards/roles-student.guard';

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
  ],
  providers: [
    JwtStrategyUser,
    RolesGuardStudent,
    RolesGuardProfessor,
    JwtAuthGuardUser,
    HashPasswordPipe,
  ],
  exports: [
    JwtStrategyUser,
    RolesGuardStudent,
    RolesGuardProfessor,
    JwtAuthGuardUser,
    JwtModule,
    HashPasswordPipe,
  ],
  controllers: [],
})
export class AuthModule {}
