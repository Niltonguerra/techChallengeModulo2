import { Body, Controller, Post } from '@nestjs/common';
import { CreatePostUseCase } from './usecases/createPost.usecase';
import { CreatePostDTO } from './dtos/createPost.DTO';
import { CreateReturnMessageDTO } from './dtos/returnMessage.DTO';

@Controller('post')
export class PostController {
  constructor(private readonly createPostUseCase: CreatePostUseCase) {}

  @Post('create')
  async CreatePost(@Body() createPostData: CreatePostDTO): Promise<CreateReturnMessageDTO> {
    const createPost: CreateReturnMessageDTO =
      await this.createPostUseCase.createPostUseCase(createPostData);
    return createPost;
  }
}
