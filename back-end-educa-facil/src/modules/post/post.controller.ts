import { Body, Controller, Post, Get, Query, Headers } from '@nestjs/common';
import { createPostUseCase } from './usecases/createPost.usecase';
import { listPostUseCase } from './usecases/listPost.usecase';
import { ListPostDTO } from './DTOs/listPost.DTO'; 
import { CreatePostDTO } from './DTOs/createPost.DTO';
import { CreateReturnMessageDTO } from './DTOs/returnMessage.DTO';
import { ReturnListPostDTO } from './DTOs/returnlistPost.DTO';


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
  async listPosts(
    @Query() query: ListPostDTO,
    @Headers('tokenSessao') tokenSessao: string,
  ): Promise<ReturnListPostDTO[]> {
    // você pode validar o token aqui se quiser
    return this.listPostUseCase.execute(query);
  }
}
