import { RolesGuardProfessor } from '@modules/auth/guards/roles-professor.guard';
import { ListAllUsersUseCase } from '../usecases/listAllUsers.usecase';
import { User } from '../entities/user.entity';
import { JwtAuthGuardUser } from '@modules/auth/guards/jwt-auth-user.guard';
import { RolesGuardStudent } from '@modules/auth/guards/roles-student.guard';
import { HashPasswordPipe } from '@modules/auth/pipe/passwordEncryption.pipe';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { Body, Controller, Get, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserDTO } from '../dtos/createUser.dto';
import { FindOneUserQueryParamsDTO } from '../dtos/findOneQueryParams.dto';
import { listAuthorsParamsDTO } from '../dtos/listAuthorsParams.dto';
import {
  FindOneUserReturnMessageDTO,
  ListUserReturnMessageDTO,
} from '../dtos/returnMessageCRUD.dto';
import { CreateUserUseCase } from '../usecases/createUser.usecase';
import { FindOneUserUseCase } from '../usecases/FindOneUser.usecase';
import { listAuthorsUseCase } from '../usecases/listAuthors.usecase';
import { UserPermissionEnum } from '@modules/auth/Enum/permission.enum';

@ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ReturnMessageDTO })
@ApiNotFoundResponse({ description: 'Not found', type: ReturnMessageDTO })
@Controller('user')
export class UserController {
  constructor(
    private readonly createPostUseCase: CreateUserUseCase,
    private readonly findOneUserUseCase: FindOneUserUseCase,
    private readonly listAuthorsUseCase: listAuthorsUseCase,
    private readonly listAllUsersUseCase: ListAllUsersUseCase,
  ) {}

  @Post('create')
  @UsePipes(HashPasswordPipe)
  @ApiOperation({ summary: 'Register new user' })
  @ApiCreatedResponse({ type: ReturnMessageDTO })
  @ApiConflictResponse({ description: 'Conflit', type: ReturnMessageDTO })
  async createUser(@Body() createPostData: CreateUserDTO): Promise<ReturnMessageDTO> {
    const createPost: ReturnMessageDTO =
      await this.createPostUseCase.validationEmailCreateUser(createPostData);
    return createPost;
  }

  @Get('/validationEmail')
  @ApiOperation({ summary: 'Validation email' })
  @ApiOkResponse({ type: ReturnMessageDTO })
  async validationEmail(@Query('token') token: string): Promise<ReturnMessageDTO> {
    const createPost: ReturnMessageDTO = await this.createPostUseCase.create(token);
    return createPost;
  }

  @Get('findOne')
  @UseGuards(JwtAuthGuardUser, RolesGuardStudent)
  @ApiBearerAuth('JWT-Auth')
  @ApiOperation({ summary: 'Search user by id' })
  @ApiOkResponse({ type: FindOneUserReturnMessageDTO })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: ReturnMessageDTO })
  async findOne(
    @Query() queryParams: FindOneUserQueryParamsDTO,
  ): Promise<FindOneUserReturnMessageDTO> {
    const findOneUser = await this.findOneUserUseCase.findOneUserUseCase(queryParams);
    return findOneUser;
  }

  @Get('authors')
  @UseGuards(JwtAuthGuardUser, RolesGuardStudent)
  @ApiBearerAuth('JWT-Auth')
  @ApiOperation({ summary: 'List all users who are authors of a post' })
  @ApiOkResponse({ type: [ListUserReturnMessageDTO] })
  async findAllAuthors(
    @Query() queryParams: listAuthorsParamsDTO,
  ): Promise<ListUserReturnMessageDTO> {
    const authors = await this.listAuthorsUseCase.listAuthors(queryParams);
    return authors;
  }

  @Get('list-all')
  @UseGuards(JwtAuthGuardUser, RolesGuardProfessor)
  @ApiBearerAuth('JWT-Auth')
  @ApiOperation({ summary: 'List all registered users (for admins/professors)' })
  @ApiOkResponse({ description: 'List of users', type: [User] })
  async findAllUsers(
    @Query('permission') permission?: UserPermissionEnum,
  ): Promise<Partial<User>[]> {
    return this.listAllUsersUseCase.execute(permission);
  }
}
//