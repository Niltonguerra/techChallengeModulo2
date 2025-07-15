import { Body, Controller, Post } from '@nestjs/common';
import { AuthUserDTO, ReturnAuthUserDTO } from '../dtos/AuthUser.dto';
import { SignInUseCase } from '../usecases/SignIn.usecase';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('user')
export class AuthController {
  constructor(private readonly signInUseCase: SignInUseCase) {}

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({ type: ReturnAuthUserDTO, isArray: false })
  @ApiBody({ type: AuthUserDTO })
  async loginUser(@Body() authUserDTO: AuthUserDTO) {
    return this.signInUseCase.UserAuthentication(authUserDTO);
  }
}
