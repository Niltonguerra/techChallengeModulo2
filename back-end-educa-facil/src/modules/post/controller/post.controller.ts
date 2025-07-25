import { Body, Controller, Post, Get, Param, Put, Query, UseGuards, Delete } from '@nestjs/common';
import { CreatePostUseCase } from '../usecases/createPost.usecase';
import { UpdatePostUseCase } from '../usecases/updatePost.usecase';
import { GetPostUseCase } from '../usecases/getPost.usecase';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { JwtAuthGuardUser } from '@modules/auth/guards/jwt-auth-user.guard';
import { RolesGuardProfessor } from '@modules/auth/guards/roles-professor.guard';
import { RolesGuardStudent } from '@modules/auth/guards/roles-student.guard';
import { ReturnListPost } from '../dtos/returnlistPost.dto';
import { ListPostUseCase } from '../usecases/listPost.usecase';
import { DeletePostUseCase } from '../usecases/deletePost.usecase';
import { CreatePostDTO } from '../dtos/createPost.dto';
import { ListPostDTO } from '../dtos/listPost.dto';
import { UpdatePostDTO } from '../dtos/updatePost.dto';
import { GetTokenValues } from '../../auth/decorators/token.decorator';
import { JwtPayload } from '@modules/auth/dtos/JwtPayload.dto';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBearerAuth('JWT-Auth')
@ApiUnauthorizedResponse({ description: 'Unauthorized', type: ReturnMessageDTO })
@ApiNotFoundResponse({ description: 'Not found', type: ReturnMessageDTO })
@ApiForbiddenResponse({ description: 'Forbidden', type: ReturnMessageDTO })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ReturnMessageDTO })
@Controller('post')
export class PostController {
  constructor(
    private readonly listPostUseCase: ListPostUseCase,
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly getPostUseCase: GetPostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuardUser, RolesGuardStudent)
  @ApiOperation({ summary: 'Return posts according to the search criteria' })
  @ApiOkResponse({ type: ReturnListPost })
  async listPosts(@Query() query: ListPostDTO): Promise<ReturnListPost> {
    return this.listPostUseCase.execute(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuardUser, RolesGuardStudent)
  @ApiOperation({ summary: 'Fetch post by ID' })
  @ApiOkResponse({ type: ReturnListPost })
  async getById(@Param('id') id: string): Promise<ReturnListPost> {
    return await this.getPostUseCase.getPostUseCaseById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuardUser, RolesGuardProfessor)
  @ApiOperation({ summary: 'Register new post from the current user' })
  @ApiCreatedResponse({ type: ReturnMessageDTO })
  @ApiConflictResponse({ description: 'Conflit', type: ReturnMessageDTO })
  async createPost(
    @Body() createPostData: CreatePostDTO,
    @GetTokenValues() rawToken: JwtPayload,
  ): Promise<ReturnMessageDTO> {
    createPostData.user_id = rawToken.id;
    const createPost: ReturnMessageDTO =
      await this.createPostUseCase.createPostUseCase(createPostData);
    return createPost;
  }

  @Put()
  @UseGuards(JwtAuthGuardUser, RolesGuardProfessor)
  @ApiOperation({ summary: 'Update existing post by id' })
  @ApiOkResponse({ type: ReturnMessageDTO })
  async updatePost(@Body() updatePostData: UpdatePostDTO): Promise<ReturnMessageDTO> {
    const updatedPost: ReturnMessageDTO = await this.updatePostUseCase.execute(updatePostData);
    return updatedPost;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuardUser, RolesGuardProfessor)
  @ApiOperation({ summary: 'Delete post by ID' })
  @ApiOkResponse({ type: ReturnMessageDTO })
  async deletePost(@Param('id') id: string): Promise<ReturnMessageDTO> {
    const deletePost: ReturnMessageDTO = await this.deletePostUseCase.deletePostUseCase(id);
    return deletePost;
  }
}
