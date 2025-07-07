import { BadRequestException, Injectable, Logger, PipeTransform } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

interface HasPassword {
  password?: string;
}

@Injectable()
export class HashPasswordPipe implements PipeTransform {
  private readonly logger = new Logger(HashPasswordPipe.name);
  private readonly saltRounds: number;

  constructor(private readonly configService: ConfigService) {
    this.saltRounds = 10;
  }

  async transform(value: HasPassword): Promise<HasPassword> {
    if (!value || typeof value !== 'object') {
      throw new BadRequestException('Invalid input data');
    }

    if (!value.password || typeof value.password !== 'string') {
      return value;
    }

    if (value.password.trim().length === 0) {
      throw new BadRequestException('Password cannot be empty');
    }

    try {
      const hashedPassword = await bcrypt.hash(value.password, this.saltRounds);
      return {
        ...value,
        password: hashedPassword,
      };
    } catch (error) {
      this.logger.error('Error hashing password:', error);
      throw new BadRequestException('Failed to process password');
    }
  }
}
