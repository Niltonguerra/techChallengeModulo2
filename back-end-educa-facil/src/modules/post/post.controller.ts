import { Body, Controller, Post, Get, Param, Put, Query, Headers } from '@nestjs/common';
import { createPostUseCase } from './usecases/createPost.usecase';
import { listPostUseCase } from './usecases/listPost.usecase';
import { ListPostDTO } from './DTOs/listPost.DTO'; 
import { CreatePostDTO } from './DTOs/createPost.DTO';
import { CreateReturnMessageDTO } from './DTOs/returnMessage.DTO';
import { UpdatePostUseCase } from './usecases/updatePost.usecase';
import { UpdatePostDTO } from './DTOs/updatePost.DTO';
import { GetPostDTO } from './DTOs/getPost.DTO';
import { GetPostUseCase } from './usecases/getPost.usecase';



@Controller('post')
export class PostController {
  constructor(
    private readonly listPostUseCase: listPostUseCase,
    private readonly createPostUseCase: createPostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly getPostUseCase: GetPostUseCase,
  ) {}

  @Post('create')
  async CreatePost(@Body() createPostData: CreatePostDTO): Promise<CreateReturnMessageDTO> {
    const createPost: CreateReturnMessageDTO =
      await this.createPostUseCase.createPostUseCase(createPostData);
    return createPost;
  }

    @Get()
async listPosts(@Query() query: ListPostDTO) {
  return this.listPostUseCase.execute(query); 
}


  @Put('update')
  async UpdatePost(@Body() updatePostData: UpdatePostDTO): Promise<CreateReturnMessageDTO> {
    const updatedPost: CreateReturnMessageDTO =
      await this.updatePostUseCase.UpdatePostUseCase(updatePostData);
    return updatedPost;
  }
    
    
  @Get('id/:id')
  async getById(@Param('id') id: string): Promise<GetPostDTO> {
    return await this.getPostUseCase.getPostUseCaseById(id);
  }
}
