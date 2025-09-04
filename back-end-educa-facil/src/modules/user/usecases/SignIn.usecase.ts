import { UserService } from '@modules/user/service/user.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthUserDTO, LoginUsuarioInternoDTO, ResponseAuthUserDTO } from '../dtos/AuthUser.dto';
import { JwtPayload } from '@modules/auth/dtos/JwtPayload.dto';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { UserStatusEnum } from '../enum/status.enum';

@Injectable()
export class SignInUseCase {
  private readonly logger = new Logger(SignInUseCase.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async userAuthentication(authUserDTO: AuthUserDTO): Promise<ResponseAuthUserDTO> {
    try {
      const { email, password } = authUserDTO;

      const validatedUser = await this.validateUser(email, password);

      if (!validatedUser) {
        throw new UnauthorizedException(systemMessage.ReturnMessage.errorlogin);
      }

      const payload: JwtPayload = {
        id: validatedUser.id,
        email: validatedUser.email,
        permission: validatedUser.permission,
      };

      return {
        token: this.jwtService.sign(payload).toString(),
        user: {
          photo: validatedUser.photo,
          name: validatedUser.name,
          email: validatedUser.email,
        },
      };
    } catch (error) {
      const message =
        error instanceof HttpException ? error.message : systemMessage.ReturnMessage.errorlogin;
      const status =
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
      this.logger.error(`${message}: ${status}`);
      throw new HttpException(`${message}: ${status}`, status);
    }
  }

  private async validateUser(
    email: string,
    password: string,
  ): Promise<LoginUsuarioInternoDTO | false> {
    const user = await this.userService.findOneUserLogin(email);

    if (!user) {
      throw new UnauthorizedException(systemMessage.ReturnMessage.errorlogin);
    }

    if (user.isActive === UserStatusEnum.PENDING) {
      return false;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return false;
    }
    return user;
  }
}
