import { Body, Controller, Get, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
import { CreateUserDTO } from '../dtos/createUser.dto';
import { FindOneUserReturnMessageDTO } from '../dtos/returnMessageCRUD.dto';
import { CreateUserUseCase } from '../usecases/createUser.usecase';
import { FindOneUserUseCase } from '../usecases/FindOneUser.usecase';
import { FindOneUserQueryParamsDTO } from '../dtos/findOneQueryParams.dto';
import { HashPasswordPipe } from '@modules/auth/pipe/passwordEncryption.pipe';
import { JwtAuthGuardUser } from '@modules/auth/guards/jwt-auth-user.guard';
import { RolesGuardProfessor } from '@modules/auth/guards/roles-professor.guard';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { ApiBearerAuth, ApiBody, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('User')
@ApiUnauthorizedResponse({description: 'Unauthorized', type: ReturnMessageDTO})
@ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ReturnMessageDTO})
@Controller('user')
export class UserController {
  constructor(
    private readonly createPostUseCase: CreateUserUseCase,
    private readonly findOneUserUseCase: FindOneUserUseCase,
  ) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt-user'))
  @ApiBearerAuth('JWT-Auth')
  @UsePipes(HashPasswordPipe)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiOkResponse({ type: ReturnMessageDTO, isArray: false })
  @ApiBody({ type: CreateUserDTO })
  async CreateUser(@Body() createPostData: CreateUserDTO): Promise<ReturnMessageDTO> {
    const createPost: ReturnMessageDTO =
      await this.createPostUseCase.validationEmailCreateUser(createPostData);
    return createPost;
  }

  @Get('/validationEmail')
  @ApiOperation({ summary: 'Validation email' })
  @ApiOkResponse({ type: ReturnMessageDTO, isArray: false })
  async validationEmail(@Query('token') token: string): Promise<ReturnMessageDTO> {
    const createPost: ReturnMessageDTO = await this.createPostUseCase.create(token);
    return createPost;
  }

  @Get('findOne')
  @ApiBearerAuth('JWT-Auth')
  @UseGuards(JwtAuthGuardUser, RolesGuardProfessor)
  @ApiOperation({ summary: 'Search find one' })
  @ApiOkResponse({ type: FindOneUserReturnMessageDTO, isArray: false })
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
