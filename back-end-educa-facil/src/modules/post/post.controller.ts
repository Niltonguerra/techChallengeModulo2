import { Body, Controller, Post, Get, Param, Put, Query, Headers, UseGuards } from '@nestjs/common';
import { CreatePostUseCase } from './usecases/createPost.usecase';
import { listPostUseCase } from './usecases/listPost.usecase';
import { ListPostDTO } from './dtos/listPost.DTO';
import { CreatePostDTO } from './dtos/createPost.DTO';
import { UpdatePostUseCase } from './usecases/updatePost.usecase';

import { GetPostUseCase } from './usecases/getPost.usecase';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { UpdatePostDTO } from './dtos/updatePost.DTO';
import { JwtAuthGuardUser } from '@modules/auth/guards/jwt-auth-user.guard';
import { RolesGuardProfessor } from '@modules/auth/guards/roles-professor.guard';
import { RolesGuardStudent } from '@modules/auth/guards/roles-student.guard';


@Controller('post')
export class PostController {
  constructor(
    private readonly listPostUseCase: listPostUseCase,
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly getPostUseCase: GetPostUseCase,
  ) {}

  @Get()
  // @UseGuards(JwtAuthGuardUser, RolesGuardStudent)
  async listPosts(@Query() query: ListPostDTO) {
    return this.listPostUseCase.execute(query);
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuardUser, RolesGuardStudent)
  async getById(@Param('id') id: string): Promise<any> {
    return await this.getPostUseCase.getPostUseCaseById(id);
  }

  @Post('create')
  // @UseGuards(JwtAuthGuardUser, RolesGuardProfessor)
  async CreatePost(@Body() createPostData: CreatePostDTO): Promise<ReturnMessageDTO> {
    const createPost: ReturnMessageDTO =
      await this.createPostUseCase.createPostUseCase(createPostData);
    return createPost;
  }

  @Put('update')
  @UseGuards(JwtAuthGuardUser, RolesGuardProfessor)
  async UpdatePost(@Body() updatePostData: UpdatePostDTO): Promise<ReturnMessageDTO> {
    const updatedPost: ReturnMessageDTO =
      await this.updatePostUseCase.UpdatePostUseCase(updatePostData);
    return updatedPost;
  }
}
