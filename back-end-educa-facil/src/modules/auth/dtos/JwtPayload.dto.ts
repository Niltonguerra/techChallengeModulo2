export interface JwtPayload {
  id: string;
  email: string;
  permission: string;
  iat?: number;
  exp?: number;
}
