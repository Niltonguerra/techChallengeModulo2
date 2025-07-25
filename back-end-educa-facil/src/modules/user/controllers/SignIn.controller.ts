import { Body, Controller, Post } from '@nestjs/common';
import { AuthUserDTO, ResponseAuthUserDTO } from '../dtos/AuthUser.dto';
import { SignInUseCase } from '../usecases/SignIn.usecase';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';

@Controller('user')
@ApiUnauthorizedResponse({ description: 'Unauthorized', type: ReturnMessageDTO })
@ApiNotFoundResponse({ description: 'Not found', type: ReturnMessageDTO })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ReturnMessageDTO })
export class AuthController {
  constructor(private readonly signInUseCase: SignInUseCase) {}

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user' })
  @ApiCreatedResponse({ type: ResponseAuthUserDTO })
  loginUser(@Body() authUserDTO: AuthUserDTO): Promise<ResponseAuthUserDTO> {
    return this.signInUseCase.userAuthentication(authUserDTO);
  }
}
