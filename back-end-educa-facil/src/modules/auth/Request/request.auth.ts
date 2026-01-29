import { JwtPayload } from '../dtos/JwtPayload.dto';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
