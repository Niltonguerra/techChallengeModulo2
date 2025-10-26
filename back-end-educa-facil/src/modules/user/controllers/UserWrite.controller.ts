import { JwtAuthGuardUser } from '@modules/auth/guards/jwt-auth-user.guard';
import { RolesGuardStudent } from '@modules/auth/guards/roles-student.guard';
import { HashPasswordPipe } from '@modules/auth/pipe/passwordEncryption.pipe';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
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
import { CreateUserUseCase } from '../usecases/createUser.usecase';
import { UserDeleteService } from '../service/userDelete.service';
import { UpdateUserDTO } from '../dtos/updateUser.dto';
import { UserService } from '../service/user.service';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { RolesGuardProfessor } from '@modules/auth/guards/roles-professor.guard';

@ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ReturnMessageDTO })
@ApiNotFoundResponse({ description: 'Not found', type: ReturnMessageDTO })
@Controller('user')
export class UserWriteController {
  private readonly logger = new Logger(UserWriteController.name);
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly userDeleteService: UserDeleteService,
    private readonly userService: UserService,
  ) {}

  @Post('create')
  @UsePipes(HashPasswordPipe)
  @ApiOperation({ summary: 'Register new user' })
  @ApiCreatedResponse({ type: ReturnMessageDTO })
  @ApiConflictResponse({ description: 'Conflit', type: ReturnMessageDTO })
  async createUser(@Body() createUserData: CreateUserDTO): Promise<ReturnMessageDTO> {
    const createUser: ReturnMessageDTO =
      await this.createUserUseCase.validationEmailCreateUser(createUserData);
    return createUser;
  }

  @Get('validationEmail')
  @ApiOperation({ summary: 'Validation email' })
  @ApiOkResponse({ type: ReturnMessageDTO })
  async validationEmail(@Query('token') token: string): Promise<ReturnMessageDTO> {
    const createUser: ReturnMessageDTO = await this.createUserUseCase.create(token);
    return createUser;
  }

  @Put('edit/:id')
  @UsePipes(HashPasswordPipe)
  @ApiOperation({ summary: 'Edit user by id' })
  @ApiCreatedResponse({ type: ReturnMessageDTO })
  @UseGuards(JwtAuthGuardUser, RolesGuardStudent)
  @ApiConflictResponse({ description: 'Conflit', type: ReturnMessageDTO })
  async EditUser(
    @Param('id') id: string,
    @Body() EditUserData: UpdateUserDTO,
  ): Promise<ReturnMessageDTO> {
    try {
      const data = { id, ...EditUserData };
      return await this.userService.createUpdateUser(data);
    } catch (error) {
      this.logger.error(`Error editing user:`, error);
      throw new InternalServerErrorException(systemMessage.ReturnMessage.errorUpdatePost);
    }
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuardUser, RolesGuardProfessor)
  @ApiBearerAuth('JWT-Auth')
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiOkResponse({ type: ReturnMessageDTO })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: ReturnMessageDTO })
  async deleteUser(@Param('id') id: string): Promise<ReturnMessageDTO> {
    try {
      return await this.userDeleteService.deleteUser(id);
    } catch (error) {
      this.logger.error(`Error deleting user ${id}`, error);
      throw new InternalServerErrorException(systemMessage.ReturnMessage.errorDeleteUser);
    }
  }
}
