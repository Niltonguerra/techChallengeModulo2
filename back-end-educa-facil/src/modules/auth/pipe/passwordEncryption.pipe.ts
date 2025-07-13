import { systemMessage } from '@config/i18n/pt/systemMessage';
import { BadRequestException, Injectable, Logger, PipeTransform } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashPasswordPipe implements PipeTransform {
  private readonly logger = new Logger(HashPasswordPipe.name);

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
      const hashedPassword = await bcrypt.hash(value.password, 10);
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
