export interface JwtPayload {
  email: string;
  permission: string;
  iat?: number;
  exp?: number;
}
