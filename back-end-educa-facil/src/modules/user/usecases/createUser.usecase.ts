import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { UserService } from '../service/user.service';
import { CreateUserDTO } from '../dtos/createUser.dto';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';

@Injectable()
export class CreatePostUseCase {
  constructor(private readonly userService: UserService) {}

  async createUserUseCase(createUserData: CreateUserDTO): Promise<ReturnMessageDTO> {
    try {
      const verificaEmail = await this.userService.findOneUser('email', createUserData.email);

      if (verificaEmail.statusCode === 200) {
        throw new Error('Email já cadastrado');
      }

      const user = await this.userService.createUser(createUserData);
      return user;
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
