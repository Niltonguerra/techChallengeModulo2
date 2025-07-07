import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateUserDTO } from './DTOs/createUser.dto';
import { CreateReturnMessageDTO, FindOneUserReturnMessageDTO } from './DTOs/returnMessage.dto';
import { CreatePostUseCase } from './usecases/createUser.usecase';
import { FindOneUserUseCase } from './usecases/FindOneUser.usecase';
import { FindOneUserQueryParamsDTO } from './DTOs/findOneQueryParams.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly findOneUserUseCase: FindOneUserUseCase,
  ) {}
  @Post('create')
  async CreateUser(@Body() createPostData: CreateUserDTO): Promise<CreateReturnMessageDTO> {
    const createPost: CreateReturnMessageDTO =
      await this.createPostUseCase.createUserUseCase(createPostData);
    return createPost;
  }

  @Get('findOne')
  async FindOne(
    @Query() queryParams: FindOneUserQueryParamsDTO,
  ): Promise<FindOneUserReturnMessageDTO> {
    const findOneUser: FindOneUserReturnMessageDTO =
      await this.findOneUserUseCase.findOneUserUseCase(queryParams.field, queryParams.value);
    return findOneUser;
  }
}
