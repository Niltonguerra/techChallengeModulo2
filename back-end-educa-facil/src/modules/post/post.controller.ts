import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { createPostUseCase } from './usecases/createPost.usecase';
import { CreatePostDTO } from './DTOs/createPost.DTO';
import { CreateReturnMessageDTO } from './DTOs/returnMessage.DTO';
import { SelectPostDTO } from './DTOs/select.DTO';
import { SelectPostUseCase } from './usecases/selectPost.usecase';
@Controller('post')
export class PostController {
  constructor(
    private readonly createPostUseCase: createPostUseCase,
    private readonly selectPostUseCase: SelectPostUseCase
  ) {}

  @Post('create')
  async CreatePost(@Body() createPostData: CreatePostDTO): Promise<CreateReturnMessageDTO> {
    const createPost: CreateReturnMessageDTO =
      await this.createPostUseCase.createPostUseCase(createPostData);
    return createPost;
  }

 @Get('id/:id')
  async getById(@Param() id:string ): Promise<SelectPostDTO[]> {
    return await this.selectPostUseCase.selectPostUseCaseById(id);;
  }
  
}
