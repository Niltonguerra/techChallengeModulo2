import { Body, Controller, Post } from '@nestjs/common';
import { AuthUserDTO } from '../dtos/AuthUser.dto';
import { SignInUseCase } from '../usecases/SignIn.usecase';

@Controller('user')
export class AuthController {
  constructor(private readonly signInUseCase: SignInUseCase) {}

  @Post('login')
  loginUser(@Body() authUserDTO: AuthUserDTO) {
    return this.signInUseCase.userAuthentication(authUserDTO);
  }
}
