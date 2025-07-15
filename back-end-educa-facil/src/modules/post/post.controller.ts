import { Body, Controller, Post, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UpdatePostUseCase } from './usecases/updatePost.usecase';
import { UpdatePostDTO } from './DTOs/updatePost.DTO';
import { GetPostDTO } from './DTOs/getPost.DTO';
import { GetPostUseCase } from './usecases/getPost.usecase';
import { CreatePostUseCase } from './usecases/createPost.usecase';
import { CreatePostDTO } from './dtos/createPost.DTO';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { ApiBearerAuth, ApiBody, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Post')
@UseGuards(AuthGuard('jwt-user'))
@ApiBearerAuth('JWT-Auth')
@ApiUnauthorizedResponse({description: 'Unauthorized', type: ReturnMessageDTO})
@ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ReturnMessageDTO})
@Controller('post')
export class PostController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly getPostUseCase: GetPostUseCase,
  ) {}
  @ApiOperation({ summary: 'Register a new post' })
  @ApiOkResponse({ type: ReturnMessageDTO, isArray: false })
  @ApiBody({ type: CreatePostDTO })
  @Post('create')
  async CreatePost(@Body() createPostData: CreatePostDTO): Promise<ReturnMessageDTO> {
    const createPost: ReturnMessageDTO =
      await this.createPostUseCase.createPostUseCase(createPostData);
    return createPost;
  }

  // edit post, type put
  @ApiOperation({ summary: 'Updated a post data' })
  @ApiOkResponse({ type: ReturnMessageDTO, isArray: false })
  @ApiBody({ type: UpdatePostDTO })
  @Put('update')
  async UpdatePost(@Body() updatePostData: UpdatePostDTO): Promise<ReturnMessageDTO> {
    const updatedPost: ReturnMessageDTO =
      await this.updatePostUseCase.UpdatePostUseCase(updatePostData);
    return updatedPost;
  }

  @ApiOperation({ summary: 'Bring the data through the id' })
  @ApiOkResponse({ type: GetPostDTO, isArray: true })
  @Get('id/:id')
  async getById(@Param('id') id: string): Promise<GetPostDTO[]> {
    return await this.getPostUseCase.getPostUseCaseById(id);
  }
}
