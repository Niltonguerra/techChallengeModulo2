import { UserService } from '@modules/user/service/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthUserDTO, LoginUsuarioInternoDTO } from '../dtos/AuthUser.dto';
import { JwtPayload } from '@modules/auth/dtos/JwtPayload.dto';

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
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return {
      token: this.geraToken(validatedUser).toString(),
    };
  }

  private async validateUser(
    email: string,
    password: string,
  ): Promise<LoginUsuarioInternoDTO | null> {
    const user = await this.userService.findOneUserLogin(email);

    if (!user) {
      return null;
    }

    const isMatch = await this.validatePassword(password, user.password);

    if (!isMatch) {
      return null;
    }
    return user;
  }

  private async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private geraToken(user: LoginUsuarioInternoDTO): string {
    const payload: JwtPayload = { email: user.email, permission: user.permission };
    return this.jwtService.sign(payload);
  }
}
