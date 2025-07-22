import { AuthUserDTO } from '../../dtos/AuthUser.dto';
import { HttpStatus } from '@nestjs/common';

export const authUserDTOMock: AuthUserDTO = {
  email: 'test@example.com',
  password: 'validPassword123',
};

export const authUserAdminDTOMock: AuthUserDTO = {
  email: 'admin@example.com',
  password: 'adminPassword123',
};

export const authUserProfessorDTOMock: AuthUserDTO = {
  email: 'professor@example.com',
  password: 'profPassword123',
};

export const authUserInactiveDTOMock: AuthUserDTO = {
  email: 'inactive@example.com',
  password: 'validPassword123',
};

export const authUserMalformedDTOMock: AuthUserDTO = {
  email: 'malformed-email',
  password: 'validPassword123',
};

export const authUserNotFoundDTOMock: AuthUserDTO = {
  email: 'nonexistent@example.com',
  password: 'anyPassword123',
};

export const authUserWrongPasswordDTOMock: AuthUserDTO = {
  email: 'test@example.com',
  password: 'wrongPassword',
};

export const authUserPlusDTOMock: AuthUserDTO = {
  email: 'user+test@example.co.uk',
  password: 'validPassword123',
};

export const expectedUserResponseMock = {
  statusCode: HttpStatus.OK,
  message: 'Login realizado com sucesso',
  data: {
    accessToken: 'jwt.token.here',
    user: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test User',
      email: 'test@example.com',
      permission: 'USER',
    },
  },
};

export const expectedAdminResponseMock = {
  statusCode: HttpStatus.OK,
  message: 'Login realizado com sucesso',
  data: {
    accessToken: 'jwt.admin.token.here',
    user: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Admin User',
      email: 'admin@example.com',
      permission: 'ADMIN',
    },
  },
};

export const expectedProfessorResponseMock = {
  statusCode: HttpStatus.OK,
  message: 'Login realizado com sucesso',
  data: {
    accessToken: 'jwt.professor.token.here',
    user: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Professor User',
      email: 'professor@example.com',
      permission: 'PROFESSOR',
    },
  },
};

export const expectedInactiveResponseMock = {
  statusCode: HttpStatus.FORBIDDEN,
  message: 'Conta não ativada. Verifique seu e-mail.',
};

export const expectedWrongPasswordResponseMock = {
  statusCode: HttpStatus.UNAUTHORIZED,
  message: 'Credenciais inválidas',
};

export const expectedNotFoundResponseMock = {
  statusCode: HttpStatus.NOT_FOUND,
  message: 'Usuário não encontrado',
};

export const expectedMalformedResponseMock = {
  statusCode: HttpStatus.BAD_REQUEST,
  message: 'Formato de e-mail inválido',
};

export const expectedServerErrorResponseMock = {
  statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  message: 'Erro interno do servidor',
};

export const expectedPlusResponseMock = {
  statusCode: HttpStatus.OK,
  message: 'Login realizado com sucesso',
  data: {
    accessToken: 'jwt.token.here',
    user: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test User',
      email: 'user+test@example.co.uk',
      permission: 'USER',
    },
  },
};
