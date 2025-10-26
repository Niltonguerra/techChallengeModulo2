import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { systemMessage } from '@config/i18n/pt/systemMessage';

@Injectable()
export class HashPasswordPipe implements PipeTransform {
  private readonly logger = new Logger(HashPasswordPipe.name);

  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    // Só processa o body
    if (metadata.type !== 'body') return value;

    // se body não existir ou não for objeto, deixa passar (ou lance BadRequest se preferir)
    if (!value || typeof value !== 'object') {
      throw new BadRequestException(
        'erro ao encontrar a senha, a senha deve estar contida dentro do um objeto',
      );
    }

    // Se não houver password, não faz nada (update sem senha)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!('password' in value) || value.password === undefined || value.password === null) {
      return value;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    if (typeof value.password !== 'string' || value.password.trim().length === 0) {
      throw new BadRequestException(systemMessage.ReturnMessage.isnotEmptyPassword);
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      const hashedPassword = await bcrypt.hash(value.password, 10);
      return { ...value, password: hashedPassword };
    } catch (error) {
      this.logger.error('Error ao processar a senha:', error);
      throw new BadRequestException(systemMessage.ReturnMessage.FailedToProcessPassword);
    }
  }
}
