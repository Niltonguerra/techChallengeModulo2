import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { UserService } from '../user.service';
import { CreateUserDTO } from '../DTOs/createUser.dto';
import { CreateReturnMessageDTO } from '../DTOs/returnMessage.DTO';

@Injectable()
export class CreatePostUseCase {
  constructor(private readonly userService: UserService) {}

  async createPostUseCase(createUserData: CreateUserDTO): Promise<CreateReturnMessageDTO> {
    try {
      const user = await this.userService.createUserService(createUserData);
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
