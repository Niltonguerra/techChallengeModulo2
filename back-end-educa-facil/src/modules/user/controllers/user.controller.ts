import { Body, Controller, Get, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
import { CreateUserDTO } from '../dtos/createUser.dto';
import { FindOneUserReturnMessageDTO } from '../dtos/returnMessageCRUD.dto';
import { CreateUserUseCase } from '../usecases/createUser.usecase';
import { FindOneUserUseCase } from '../usecases/FindOneUser.usecase';
import { FindOneUserQueryParamsDTO } from '../dtos/findOneQueryParams.dto';
import { HashPasswordPipe } from '@modules/auth/pipe/passwordEncryption.pipe';
import { JwtAuthGuardUser } from '@modules/auth/guards/jwt-auth-user.guard';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { RolesGuardStudent } from '@modules/auth/guards/roles-student.guard';
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

@ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ReturnMessageDTO })
@ApiNotFoundResponse({ description: 'Not found', type: ReturnMessageDTO })
@Controller('user')
export class UserController {
  constructor(
    private readonly createPostUseCase: CreateUserUseCase,
    private readonly findOneUserUseCase: FindOneUserUseCase,
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
}
