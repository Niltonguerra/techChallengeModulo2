import { Body, Controller, Post, Get, Param, Put, Query, Headers } from '@nestjs/common';
import { CreatePostUseCase } from './usecases/createPost.usecase';
import { listPostUseCase } from './usecases/listPost.usecase';
import { ListPostDTO } from './DTOs/listPost.DTO'; 
import { CreatePostDTO } from './dtos/createPost.DTO';
import { UpdatePostUseCase } from './usecases/updatePost.usecase';
import { UpdatePostDTO } from './DTOs/updatePost.DTO';
import { GetPostDTO } from './DTOs/getPost.DTO';
import { GetPostUseCase } from './usecases/getPost.usecase';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';



@Controller('post')
export class PostController {
  constructor(
    private readonly listPostUseCase: listPostUseCase,
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly getPostUseCase: GetPostUseCase,
  ) {}

  @Post('create')
  async CreatePost(@Body() createPostData: CreatePostDTO): Promise<ReturnMessageDTO> {
    const createPost: ReturnMessageDTO =
      await this.createPostUseCase.createPostUseCase(createPostData);
    return createPost;
  }

    @Get()
async listPosts(@Query() query: ListPostDTO) {
  return this.listPostUseCase.execute(query); 
}


  @Put('update')
  async UpdatePost(@Body() updatePostData: UpdatePostDTO): Promise<ReturnMessageDTO> {
    const updatedPost: ReturnMessageDTO =
      await this.updatePostUseCase.UpdatePostUseCase(updatePostData);
    return updatedPost;
  }

  @Get('id/:id')
  async getById(@Param('id') id: string): Promise<GetPostDTO[]> {
    return await this.getPostUseCase.getPostUseCaseById(id);
  }
}
