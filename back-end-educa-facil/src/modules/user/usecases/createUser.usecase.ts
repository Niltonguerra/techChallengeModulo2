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
      // const existingUser = await this.userService.findOneUser('email', createUserData.email);

      // if (existingUser.statusCode === 200) {
      //   throw new HttpException(systemMessage.ReturnMessage.errorCreateUser, HttpStatus.CONFLICT);
      // }

      // const emailStatus = this.emailService.EnviaVerificacaoEmail(
      //   createUserData.email,
      //   'user/validationEmail',
      // );

      // if (emailStatus !== 200) {
      //   throw new HttpException(systemMessage.ReturnMessage.errorSendEmail, HttpStatus.BAD_GATEWAY);
      // }

      const createUser: Omit<IUser, 'id'> = {
        ...createUserData,
        isActive: UserStatus.PENDING,
      };

      await this.userService.createUpdateUser(createUser);

      return {
        statusCode: HttpStatus.CREATED,
        message: systemMessage.ReturnMessage.sucessCreateUserValidationEmail,
      };
    } catch (error) {
      const errorMessage =
        error instanceof HttpException
          ? error.message
          : systemMessage.ReturnMessage.errorCreateUser;

      const status =
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

      console.error(error);
      throw new HttpException(
        `${systemMessage.ReturnMessage.errorCreateUser}: ${errorMessage}`,
        status,
      );
    }
  }

  async create(token: string): Promise<ReturnMessageDTO> {
    try {
      const userData = await this.userService.findOneUser('email', token);

      if (userData.statusCode !== 200 || !('user' in userData)) {
        throw new HttpException(
          systemMessage.ReturnMessage.errorUserNotFound,
          HttpStatus.NOT_FOUND,
        );
      }

      const ChangeStatusUser: Partial<IUser> = {
        id: userData.user.id,
        isActive: UserStatus.ACTIVE,
      };

      await this.userService.createUpdateUser(ChangeStatusUser);

      return {
        statusCode: HttpStatus.CREATED,
        message: systemMessage.ReturnMessage.sucessCreateUser,
      };
    } catch (error) {
      console.error(error);
      const message =
        error instanceof HttpException
          ? error.message
          : systemMessage.ReturnMessage.errorCreateUser;

      const status =
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(`${systemMessage.ReturnMessage.errorCreateUser}: ${message}`, status);
    }
  }
}
