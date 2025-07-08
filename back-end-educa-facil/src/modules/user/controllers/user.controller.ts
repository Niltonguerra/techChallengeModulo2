import { Body, Controller, Get, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
import { CreateUserDTO } from '../dtos/createUser.dto';
import { FindOneUserReturnMessageDTO } from '../dtos/returnMessageCRUD.dto';
import { CreatePostUseCase } from '../usecases/createUser.usecase';
import { FindOneUserUseCase } from '../usecases/FindOneUser.usecase';
import { FindOneUserQueryParamsDTO } from '../dtos/findOneQueryParams.dto';
import { HashPasswordPipe } from '@modules/auth/pipe/passwordEncryption.pipe';
import { JwtAuthGuardUser } from '@modules/auth/guards/jwt-auth-user.guard';
import { RolesGuardProfessor } from '@modules/auth/guards/roles-professor.guard';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly findOneUserUseCase: FindOneUserUseCase,
  ) {}

  @Post('create')
  @UsePipes(HashPasswordPipe)
  async CreateUser(@Body() createPostData: CreateUserDTO): Promise<ReturnMessageDTO> {
    const createPost: ReturnMessageDTO =
      await this.createPostUseCase.createUserUseCase(createPostData);
    return createPost;
  }

  @Get('findOne')
  @UseGuards(JwtAuthGuardUser, RolesGuardProfessor)
  async FindOne(
    @Query() queryParams: FindOneUserQueryParamsDTO,
  ): Promise<FindOneUserReturnMessageDTO | ReturnMessageDTO> {
    const findOneUser = await this.findOneUserUseCase.findOneUserUseCase(
      queryParams.field,
      queryParams.value,
    );
    return findOneUser;
  }
}
