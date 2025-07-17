<<<<<<< HEAD
import { Body, Controller, Post, Get, Param, Put, Query, Headers, UseGuards } from '@nestjs/common';
import { CreatePostUseCase } from './usecases/createPost.usecase';
import { ListPostDTO } from './dtos/listPost.DTO';
import { CreatePostDTO } from './dtos/createPost.DTO';
import { UpdatePostUseCase } from './usecases/updatePost.usecase';
import { GetPostUseCase } from './usecases/getPost.usecase';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { UpdatePostDTO } from './dtos/updatePost.DTO';
import { JwtAuthGuardUser } from '@modules/auth/guards/jwt-auth-user.guard';
import { RolesGuardProfessor } from '@modules/auth/guards/roles-professor.guard';
import { RolesGuardStudent } from '@modules/auth/guards/roles-student.guard';
import { ReturnListPost } from './dtos/returnlistPost.DTO';
import { ListPostUseCase } from './usecases/listPost.usecase';
=======

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
>>>>>>> main

@Controller('post')
export class PostController {
  constructor(
    private readonly listPostUseCase: ListPostUseCase,
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly getPostUseCase: GetPostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
  ) {}

<<<<<<< HEAD
  @Get()
  @UseGuards(JwtAuthGuardUser, RolesGuardStudent)
  async listPosts(@Query() query: ListPostDTO): Promise<ReturnListPost> {
    return this.listPostUseCase.execute(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuardUser, RolesGuardStudent)
  async getById(@Param('id') id: string): Promise<ReturnListPost> {
    return await this.getPostUseCase.getPostUseCaseById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuardUser, RolesGuardProfessor)
=======
  @UseGuards(JwtAuthGuardUser, RolesGuardProfessor)
  @Post('create')
>>>>>>> main
  async CreatePost(@Body() createPostData: CreatePostDTO): Promise<ReturnMessageDTO> {
    const createPost: ReturnMessageDTO =
      await this.createPostUseCase.createPostUseCase(createPostData);
    return createPost;
  }

<<<<<<< HEAD
  @Put()
  @UseGuards(JwtAuthGuardUser, RolesGuardProfessor)
=======


  @Delete(':id')
  async deletePost(@Param('id') id: string): Promise<ReturnMessageDTO> {
    const deletePost: ReturnMessageDTO = await this.deletePostUseCase.deletePostUseCase(id);
    return deletePost;
  }

  // edit post, type put

  @UseGuards(JwtAuthGuardUser, RolesGuardProfessor)
  @Put('update')
>>>>>>> main
  async UpdatePost(@Body() updatePostData: UpdatePostDTO): Promise<ReturnMessageDTO> {
    const updatedPost: ReturnMessageDTO =
      await this.updatePostUseCase.UpdatePostUseCase(updatePostData);
    return updatedPost;
  }
<<<<<<< HEAD
=======

  @UseGuards(JwtAuthGuardUser, RolesGuardStudent)
  @Get('id/:id')
  async getById(@Param('id') id: string): Promise<GetPostDTO[]> {
    return await this.getPostUseCase.getPostUseCaseById(id);
  }
>>>>>>> main
}
