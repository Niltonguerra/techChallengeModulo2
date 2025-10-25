import { JwtAuthGuardUser } from '@modules/auth/guards/jwt-auth-user.guard';
import { RolesGuardStudent } from '@modules/auth/guards/roles-student.guard';
import { HashPasswordPipe } from '@modules/auth/pipe/passwordEncryption.pipe';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
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

@ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ReturnMessageDTO })
@ApiNotFoundResponse({ description: 'Not found', type: ReturnMessageDTO })
@Controller('user')
export class UserWriteController {
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
  @ApiOperation({ summary: 'Edit user by id' })
  @ApiCreatedResponse({ type: ReturnMessageDTO })
  @ApiConflictResponse({ description: 'Conflit', type: ReturnMessageDTO })
  async EditUser(@Body() EditUserData: UpdateUserDTO): Promise<ReturnMessageDTO> {
    try {
      return await this.userService.createUpdateUser(EditUserData);
    } catch {
      return {
        statusCode: 500,
        message: systemMessage.ReturnMessage.errorDeleteUser,
      };
    }
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuardUser, RolesGuardStudent)
  @ApiBearerAuth('JWT-Auth')
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiOkResponse({ type: ReturnMessageDTO })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: ReturnMessageDTO })
  async deleteUser(@Param('id') id: string): Promise<ReturnMessageDTO> {
    try {
      return await this.userDeleteService.deleteUser(id);
    } catch {
      return {
        statusCode: 500,
        message: systemMessage.ReturnMessage.errorDeleteUser,
      };
    }
  }
}
