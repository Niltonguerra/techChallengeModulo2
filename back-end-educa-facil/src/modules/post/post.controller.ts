import { Body, Controller, Post } from '@nestjs/common';
import { CreatePostUseCase } from './usecases/createPost.usecase';
import { CreatePostDTO } from './dtos/createPost.DTO';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';

@Controller('post')
export class PostController {
  constructor(private readonly createPostUseCase: CreatePostUseCase) {}

  @Post('create')
  async CreatePost(@Body() createPostData: CreatePostDTO): Promise<ReturnMessageDTO> {
    const createPost: ReturnMessageDTO =
      await this.createPostUseCase.createPostUseCase(createPostData);
    return createPost;
  }
}
