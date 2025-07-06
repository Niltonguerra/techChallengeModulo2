import { Body, Controller, Post, Get, Query, Headers } from '@nestjs/common';
import { createPostUseCase } from './usecases/createPost.usecase';
import { listPostUseCase } from './usecases/listPost.usecase';
import { ListPostDTO } from './DTOs/listPost.DTO'; 
import { CreatePostDTO } from './DTOs/createPost.DTO';
import { CreateReturnMessageDTO } from './DTOs/returnMessage.DTO';


@Controller('post')
export class PostController {
  constructor(
    private readonly createPostUseCase: createPostUseCase,
    private readonly listPostUseCase: listPostUseCase,
  ) {}

  @Post('create')
  async CreatePost(@Body() createPostData: CreatePostDTO): Promise<CreateReturnMessageDTO> {
    const createPost: CreateReturnMessageDTO =
      await this.createPostUseCase.createPostUseCase(createPostData);
    return createPost;
  }

    @Get()
  async listPosts(@Query() query: ListPostDTO) {
    const offset = query.offset ? parseInt(query.offset) : 0;
    const limit = query.limit ? parseInt(query.limit) : 10;

    return this.listPostUseCase.execute({
      ...query,
      offset: offset.toString(),
      limit: limit.toString(),
    });
  }
}