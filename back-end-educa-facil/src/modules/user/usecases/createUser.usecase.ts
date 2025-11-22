import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { UserService } from '../service/user.service';
import { CreateUserDTO } from '../dtos/createUser.dto';
import { EmailService } from '@modules/email/service/email.service';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { UserStatusEnum } from '../enum/status.enum';
import { IUser } from '../interfaces/user.interface';
import { searchByFieldUserEnum } from '../enum/searchByFieldUser.enum';

@Injectable()
export class CreateUserUseCase {
  private readonly logger = new Logger(CreateUserUseCase.name);
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  async validationEmailCreateUser(createUserData: CreateUserDTO): Promise<ReturnMessageDTO> {
    try {
      // Verifica se já existe usuário com o mesmo email
      const existingUser = await this.userService.findOneUser(
        searchByFieldUserEnum.EMAIL,
        createUserData.email,
      );

      if (existingUser.statusCode === 200) {
        // Se já existe, lança conflito (não importa se está inativo)
        const message = systemMessage.ReturnMessage.errorCreateUser;
        const status = HttpStatus.CONFLICT;
        this.logger.error(`${message}: ${status}`);
        throw new HttpException(`${message}: ${status}`, status);
      }

      // Envia email de verificação
      const emailStatus = await this.emailService.enviaVerificacaoEmail(
        createUserData.email,
        'user/validationEmail',
      );

      if (emailStatus !== 200) {
        this.logger.error(systemMessage.ReturnMessage.errorSendEmail);
        throw new HttpException(systemMessage.ReturnMessage.errorSendEmail, HttpStatus.BAD_GATEWAY);
      }

      // Cria usuário novo
      const createUser: Omit<IUser, 'id'> = {
        ...createUserData,
        is_active: UserStatusEnum.PENDING, // pendente até validar email
      };

      await this.userService.createUpdateUser(createUser);

      return {
        statusCode: HttpStatus.CREATED,
        message: systemMessage.ReturnMessage.sucessCreateUserValidationEmail,
      };
    } catch (error) {
      const message =
        error instanceof HttpException
          ? error.message
          : systemMessage.ReturnMessage.errorCreateUser;
      const status =
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
      this.logger.error(`${message}: ${status}`);
      throw new HttpException(`${message}: ${status}`, status);
    }
  }

  async updateStatus(token: string): Promise<ReturnMessageDTO> {
    try {
      const userData = await this.userService.findOneUser(
        searchByFieldUserEnum.EMAIL,
        token,
        UserStatusEnum.PENDING,
      );

      if (userData.statusCode !== 200 || !userData.user) {
        this.logger.error(systemMessage.ReturnMessage.errorUserNotFound);
        throw new HttpException(
          systemMessage.ReturnMessage.errorUserNotFound,
          HttpStatus.NOT_FOUND,
        );
      }

      const ChangeStatusUser: Partial<IUser> = {
        id: userData.user.id,
        is_active: UserStatusEnum.ACTIVE,
      };

      await this.userService.createUpdateUser(ChangeStatusUser);

      return {
        statusCode: HttpStatus.CREATED,
        message: systemMessage.ReturnMessage.sucessCreateUser,
      };
    } catch (error) {
      const message =
        error instanceof HttpException
          ? error.message
          : systemMessage.ReturnMessage.errorCreateUser;
      const status =
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

      this.logger.error(`${systemMessage.ReturnMessage.errorCreateUser}: ${message}`, status);
      throw new HttpException(`${systemMessage.ReturnMessage.errorCreateUser}: ${message}`, status);
    }
  }
}
