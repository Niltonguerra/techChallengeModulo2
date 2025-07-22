import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './service/email.service';

@Module({
  imports: [ConfigModule, JwtModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
