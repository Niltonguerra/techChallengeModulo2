import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../dtos/JwtPayload.dto';

@Injectable()
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class JwtStrategyUser extends PassportStrategy(Strategy, 'jwt-user') {
  private readonly logger = new Logger(JwtStrategyUser.name);
  constructor(private readonly configService: ConfigService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', ''),
    });
  }

  validate(payload: JwtPayload): Promise<JwtPayload> {
    return Promise.resolve({
      permission: payload.permission,
      email: payload.email,
    });
  }
}
