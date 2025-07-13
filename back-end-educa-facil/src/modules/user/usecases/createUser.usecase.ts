import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { UserService } from '../service/user.service';
import { CreateUserDTO } from '../dtos/createUser.dto';
import { EmailService } from '@modules/email/email.service';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { UserStatus } from '../entities/enum/status.enum';
import { IUser } from '../entities/interfaces/user.interface';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  async validationEmailCreateUser(createUserData: CreateUserDTO): Promise<ReturnMessageDTO> {
    try {
      const verificaEmail = await this.userService.findOneUser('email', createUserData.email);

      if (verificaEmail.statusCode === 200) {
        throw new Error('Email já cadastrado');
      }

      const ReturnEmail = this.emailService.EnviaVerificacaoEmail(
        createUserData.email,
        'user/validationEmail',
      );

      if (ReturnEmail !== 200) {
        throw new Error('Falha ao enviar o e-mail de verificação');
      }

      const createUser: Omit<IUser, 'id'> = {
        ...createUserData,
        isActive: UserStatus.PENDING,
      };
      await this.userService.createUpdateUser(createUser);
      const returnMessage: ReturnMessageDTO = {
        statusCode: HttpStatus.CREATED,
        message: systemMessage.ReturnMessage.sucessCreateUserValidationEmail,
      };
      return returnMessage;
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : systemMessage.ReturnMessage.errorCreatePost;
      throw new HttpException(
        `Erro ao criar o post: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(token: string): Promise<ReturnMessageDTO> {
    try {
      const userData = await this.userService.findOneUser('email', token);

      if (userData.statusCode !== 200) {
        throw new Error('Email não encontrado');
      }

      if ('user' in userData) {
        const ChangeStatusUser: Partial<IUser> = {
          id: userData.user.id,
          isActive: UserStatus.ACTIVE,
        };
        await this.userService.createUpdateUser(ChangeStatusUser);
      }

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Usuário criado com sucesso!',
      };
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : systemMessage.ReturnMessage.errorCreatePost;
      throw new HttpException(
        `Erro ao criar o post: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
