import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../dtos/JwtPayload.dto';

export const GetTokenValues = createParamDecorator(
  (data: unknown, context: ExecutionContext): JwtPayload => {
    const request = context.switchToHttp().getRequest<{ user?: JwtPayload }>();
    return request.user as JwtPayload;
  },
);
