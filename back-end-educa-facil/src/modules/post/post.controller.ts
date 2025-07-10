import { Body, Controller, Delete, Param, Post, Put, Get } from '@nestjs/common';
import { createPostUseCase } from './usecases/createPost.usecase';
import { CreatePostDTO } from './DTOs/createPost.DTO';
import { CreateReturnMessageDTO, DeleteReturnMessageDTO } from './DTOs/returnMessage.DTO';
import { DeletePostUseCase } from './usecases/deletePost.usecase';
import { UpdatePostUseCase } from './usecases/updatePost.usecase';
import { UpdatePostDTO } from './DTOs/updatePost.DTO';
import { GetPostDTO } from './DTOs/getPost.DTO';
import { GetPostUseCase } from './usecases/getPost.usecase';

@Controller()
export class PostController {
  constructor(
    private readonly createPostUseCase: createPostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly getPostUseCase: GetPostUseCase,
  ) { }

  @Post('create')
  async CreatePost(@Body() createPostData: CreatePostDTO): Promise<CreateReturnMessageDTO> {
    const createPost: CreateReturnMessageDTO =
      await this.createPostUseCase.createPostUseCase(createPostData);
    return createPost;
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string): Promise<DeleteReturnMessageDTO> {
    const deletePost: DeleteReturnMessageDTO = await this.deletePostUseCase.deletePostUseCase(id);
    return deletePost;
  }

  // edit post, type put
  @Put('update')
  async UpdatePost(@Body() updatePostData: UpdatePostDTO): Promise<CreateReturnMessageDTO> {
    const updatedPost: CreateReturnMessageDTO =
      await this.updatePostUseCase.UpdatePostUseCase(updatePostData);
    return updatedPost;
  }


  @Get('id/:id')
  async getById(@Param('id') id: string): Promise<GetPostDTO[]> {
    return await this.getPostUseCase.getPostUseCaseById(id);
  }
}


