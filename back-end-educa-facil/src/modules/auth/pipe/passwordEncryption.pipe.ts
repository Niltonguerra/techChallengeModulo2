import { systemMessage } from '@config/i18n/pt/systemMessage';
import { BadRequestException, Injectable, Logger, PipeTransform } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashPasswordPipe implements PipeTransform {
  private readonly logger = new Logger(HashPasswordPipe.name);
  private readonly saltRounds: number;

  constructor(private readonly configService: ConfigService) {
    this.saltRounds = 10;
  }

  async transform(value: { password?: string }): Promise<{ password: string }> {
    if (!value || typeof value !== 'object') {
      throw new BadRequestException(systemMessage.ReturnMessage.isObject);
    }

    if (!value.password || typeof value.password !== 'string') {
      throw new BadRequestException(systemMessage.ReturnMessage.isnotEmptyPassword);
    }

    if (value.password.trim().length === 0) {
      throw new BadRequestException(systemMessage.ReturnMessage.isnotEmptyPassword);
    }

    try {
      const hashedPassword = await bcrypt.hash(value.password, this.saltRounds);
      return {
        ...value,
        password: hashedPassword,
      };
    } catch (error) {
      this.logger.error('Error ao processar a senha:', error);
      throw new BadRequestException(systemMessage.ReturnMessage.FailedToProcessPassword);
    }
  }
}
