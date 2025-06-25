import { Body, Controller, Post, Put } from '@nestjs/common';
import { createPostUseCase } from './usecases/createPost.usecase';
import { CreatePostDTO } from './DTOs/createPost.DTO';
import { CreateReturnMessageDTO } from './DTOs/returnMessage.DTO';
import { UpdatePostUseCase } from './usecases/updatePost.usecase';
import { UpdatePostDTO } from './DTOs/updatePost.DTO';

@Controller()
export class PostController {
  constructor(
    private readonly createPostUseCase: createPostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
  ) {}

  @Post('create')
  async CreatePost(@Body() createPostData: CreatePostDTO): Promise<CreateReturnMessageDTO> {
    const createPost: CreateReturnMessageDTO =
      await this.createPostUseCase.createPostUseCase(createPostData);
    return createPost;
  }

  // edit post, type put
  @Put('update')
  async UpdatePost(@Body() updatePostData: UpdatePostDTO): Promise<CreateReturnMessageDTO> {
    const updatedPost: CreateReturnMessageDTO =
      await this.updatePostUseCase.UpdatePostUseCase(updatePostData);
    return updatedPost;
  }
}
