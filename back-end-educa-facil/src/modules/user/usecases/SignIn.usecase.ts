import { UserService } from '@modules/user/service/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthUserDTO, LoginUsuarioInternoDTO } from '../dtos/AuthUser.dto';
import { JwtPayload } from '@modules/auth/dtos/JwtPayload.dto';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { UserStatus } from '../entities/enum/status.enum';

@Injectable()
export class SignInUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async UserAuthentication(authUserDTO: AuthUserDTO): Promise<object | null> {
    const { email, password } = authUserDTO;

    const validatedUser = await this.validateUser(email, password);

    if (!validatedUser) {
      throw new UnauthorizedException(systemMessage.ReturnMessage.errorlogin);
    }

    const payload: JwtPayload = {
      email: validatedUser.email,
      permission: validatedUser.permission,
    };

    return {
      token: this.jwtService.sign(payload).toString(),
    };
  }

  private async validateUser(
    email: string,
    password: string,
  ): Promise<LoginUsuarioInternoDTO | null> {
    const user = await this.userService.findOneUserLogin(email);

    if (user!.isActive === UserStatus.PENDING) {
      return null;
    }

    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return null;
    }
    return user;
  }
}
