import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from './DTOs/createUser.dto';
import { CreateReturnMessageDTO } from './DTOs/returnMessage.DTO';
import { CreatePostUseCase } from './usecases/createPost.usecase';

@Controller('user')
export class UserController {
  constructor(private readonly createPostUseCase: CreatePostUseCase) {}

  @Post('create')
  async CreatePost(@Body() createPostData: CreateUserDTO): Promise<CreateReturnMessageDTO> {
    const createPost: CreateReturnMessageDTO =
      await this.createPostUseCase.createPostUseCase(createPostData);
    return createPost;
  }
}
