// Mocks para roles-student.guard.spec.ts
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '@modules/auth/dtos/JwtPayload.dto';

export const mockReflector: Partial<Reflector> = {
  get: jest.fn(),
  getAllAndOverride: jest.fn(),
};

export const mockJwtService: Partial<JwtService> = {
  verify: jest.fn(),
  sign: jest.fn(),
};

export const mockRequest: { user: JwtPayload } = {
  user: {
    email: 'test@example.com',
    permission: 'user',
    id: '123',
  },
};

// getRequest sempre retorna o valor atualizado de mockRequest
export const getRequest = jest.fn(() => mockRequest);

export const mockExecutionContext: Partial<ExecutionContext> = {
  switchToHttp: jest.fn().mockReturnValue({
    getRequest,
    getResponse: jest.fn(),
  }),
  getHandler: jest.fn(),
  getClass: jest.fn(),
};
