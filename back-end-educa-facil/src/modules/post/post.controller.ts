
import { Body, Controller, Post, Get, Param, Put, UseGuards, Delete } from '@nestjs/common';
import { UpdatePostUseCase } from './usecases/updatePost.usecase';
import { UpdatePostDTO } from './DTOs/updatePost.DTO';
import { GetPostDTO } from './DTOs/getPost.DTO';
import { GetPostUseCase } from './usecases/getPost.usecase';
import { CreatePostUseCase } from './usecases/createPost.usecase';
import { CreatePostDTO } from './DTOs/createPost.DTO';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { DeletePostUseCase } from './usecases/deletePost.usecase';
import { RolesGuardStudent } from '@modules/auth/guards/roles-student.guard';
import { RolesGuardProfessor } from '@modules/auth/guards/roles-professor.guard';
import { JwtAuthGuardUser } from '@modules/auth/guards/jwt-auth-user.guard';

@Controller('post')
export class PostController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly getPostUseCase: GetPostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
  ) {}

  @UseGuards(JwtAuthGuardUser, RolesGuardProfessor)
  @Post('create')
  async CreatePost(@Body() createPostData: CreatePostDTO): Promise<ReturnMessageDTO> {
    const createPost: ReturnMessageDTO =
      await this.createPostUseCase.createPostUseCase(createPostData);
    return createPost;
  }



  @Delete(':id')
  async deletePost(@Param('id') id: string): Promise<ReturnMessageDTO> {
    const deletePost: ReturnMessageDTO = await this.deletePostUseCase.deletePostUseCase(id);
    return deletePost;
  }

  // edit post, type put

  @UseGuards(JwtAuthGuardUser, RolesGuardProfessor)
  @Put('update')
  async UpdatePost(@Body() updatePostData: UpdatePostDTO): Promise<ReturnMessageDTO> {
    const updatedPost: ReturnMessageDTO =
      await this.updatePostUseCase.UpdatePostUseCase(updatePostData);
    return updatedPost;
  }

  @UseGuards(JwtAuthGuardUser, RolesGuardStudent)
  @Get('id/:id')
  async getById(@Param('id') id: string): Promise<GetPostDTO[]> {
    return await this.getPostUseCase.getPostUseCaseById(id);
  }
}
