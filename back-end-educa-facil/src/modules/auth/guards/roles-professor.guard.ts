import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../dtos/JwtPayload.dto';
import { systemMessage } from '@config/i18n/pt/systemMessage';

@Injectable()
export class RolesGuardProfessor implements CanActivate {
  private readonly logger = new Logger(RolesGuardProfessor.name);
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user: JwtPayload }>();
    const user: JwtPayload = request.user;

    if (user.permission !== 'admin') {
      throw new ForbiddenException(systemMessage.ReturnMessage.NotAcess);
    }

    return true;
  }
}
