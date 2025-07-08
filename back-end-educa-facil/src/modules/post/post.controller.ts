import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { createPostUseCase } from './usecases/createPost.usecase';
import { CreatePostDTO } from './DTOs/createPost.DTO';
import { CreateReturnMessageDTO, DeleteReturnMessageDTO } from './DTOs/returnMessage.DTO';
import { DeletePostUseCase } from './usecases/deletePost.usecase';

@Controller('post')
export class PostController {
  constructor(
    private readonly createPostUseCase: createPostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase  
  ) {}

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

}


