import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../dtos/JwtPayload.dto';
import { Request } from 'express';

export const GetTokenValues = createParamDecorator(
  (data: unknown, context: ExecutionContext): JwtPayload => {
    const request = context.switchToHttp().getRequest<{ user?: JwtPayload }>();
    return request.user as JwtPayload;
  },
);
export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
