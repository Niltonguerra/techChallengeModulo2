import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import {
  mockReflector,
  mockJwtService,
  mockExecutionContext,
  mockRequest,
} from './__mocks__/roles-professor.guard.mock';
import { RolesGuardProfessor } from './roles-professor.guard';
import { JwtPayload } from '../dtos/JwtPayload.dto';
import { systemMessage } from '@config/i18n/pt/systemMessage';

describe('RolesGuardProfessor', () => {
  let guard: RolesGuardProfessor;

  beforeEach(async () => {
    const { RolesGuardProfessor } = await import('./roles-professor.guard');
    const { Reflector } = await import('@nestjs/core');
    const { JwtService } = await import('@nestjs/jwt');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuardProfessor,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    guard = module.get<RolesGuardProfessor>(RolesGuardProfessor);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Inicialização', () => {
    it('should be defined', () => {
      expect(guard).toBeDefined();
    });

    it('should have a logger instance', () => {
      expect(guard['logger']).toBeInstanceOf(Logger);
      expect(guard['logger']['context']).toBe('RolesGuardProfessor');
    });

    it('should have reflector and jwtService injected', () => {
      expect(guard['reflector']).toBeDefined();
      expect(guard['jwtService']).toBeDefined();
    });
  });

  describe('canActivate - Success Cases', () => {
    it('should return true for user with admin permission', () => {
      mockRequest.user = {
        email: 'admin@example.com',
        permission: 'admin',
        id: '123',
      };

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result).toBe(true);
      expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
    });

    it('should handle different email formats for admin users', () => {
      const adminEmails = [
        'professor@university.edu',
        'admin.professor@example.com',
        'super+admin@domain.org',
        'system.administrator@company.co.uk',
      ];

      adminEmails.forEach((email) => {
        mockRequest.user = {
          email,
          permission: 'admin',
          id: '123',
        };

        const result = guard.canActivate(mockExecutionContext as ExecutionContext);

        expect(result).toBe(true);
      });
    });

    it('should work with different admin user scenarios', () => {
      const testCases = [
        { email: 'head.professor@university.edu', permission: 'admin', id: '123' },
        { email: 'dean@academic.institution.org', permission: 'admin', id: '123' },
        { email: 'coordinator@education.gov', permission: 'admin', id: '123' },
      ];

      testCases.forEach((userCase) => {
        mockRequest.user = userCase;

        const result = guard.canActivate(mockExecutionContext as ExecutionContext);

        expect(result).toBe(true);
      });
    });
  });

  describe('canActivate - Error Cases', () => {
    it('should throw ForbiddenException for student permission', () => {
      mockRequest.user = {
        email: 'student@example.com',
        permission: 'student',
        id: '123',
      };

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(ForbiddenException);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(systemMessage.ReturnMessage.NotAcess);
    });

    it('should throw ForbiddenException for user permission', () => {
      mockRequest.user = {
        email: 'regular.user@example.com',
        permission: 'user',
        id: '123',
      };

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(ForbiddenException);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(systemMessage.ReturnMessage.NotAcess);
    });

    it('should throw ForbiddenException for teacher permission', () => {
      mockRequest.user = {
        email: 'teacher@example.com',
        permission: 'teacher',
        id: '123',
      };

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(ForbiddenException);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(systemMessage.ReturnMessage.NotAcess);
    });

    it('should throw ForbiddenException for invalid permission', () => {
      mockRequest.user = {
        email: 'invalid@example.com',
        permission: 'invalid_role',
        id: '123',
      };

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(ForbiddenException);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(systemMessage.ReturnMessage.NotAcess);
    });

    it('should throw ForbiddenException for empty permission', () => {
      mockRequest.user = {
        email: 'empty@example.com',
        permission: '',
        id: '123',
      };

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(ForbiddenException);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(systemMessage.ReturnMessage.NotAcess);
    });

    it('should handle case sensitivity in permissions correctly', () => {
      const invalidPermissions = ['ADMIN', 'Admin', 'AdMiN', 'administrator'];

      invalidPermissions.forEach((permission) => {
        mockRequest.user = {
          email: 'case.test@example.com',
          permission,
          id: '123',
        };

        expect(() => {
          guard.canActivate(mockExecutionContext as ExecutionContext);
        }).toThrow(ForbiddenException);
      });
    });

    it('should throw ForbiddenException for null permission', () => {
      mockRequest.user = {
        email: 'null@example.com',
        permission: null as unknown as string,
        id: '123',
      };

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(ForbiddenException);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(systemMessage.ReturnMessage.NotAcess);
    });

    it('should throw ForbiddenException for undefined permission', () => {
      mockRequest.user = {
        email: 'undefined@example.com',
        permission: undefined as unknown as string,
        id: '123',
      };

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(ForbiddenException);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(systemMessage.ReturnMessage.NotAcess);
    });
  });

  describe('Context handling', () => {
    it('should correctly extract request from HTTP context', () => {
      const switchToHttpSpy = jest.spyOn(mockExecutionContext, 'switchToHttp');
      const getRequestSpy = jest.fn().mockReturnValue(mockRequest);

      (mockExecutionContext.switchToHttp as jest.Mock).mockReturnValue({
        getRequest: getRequestSpy,
        getResponse: jest.fn(),
      });

      mockRequest.user = {
        email: 'context.admin@example.com',
        permission: 'admin',
        id: '123',
      };

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(switchToHttpSpy).toHaveBeenCalled();
      expect(getRequestSpy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should handle multiple consecutive calls correctly', () => {
      mockRequest.user = {
        email: 'multiple.admin@example.com',
        permission: 'admin',
        id: '123',
      };

      const result1 = guard.canActivate(mockExecutionContext as ExecutionContext);
      const result2 = guard.canActivate(mockExecutionContext as ExecutionContext);
      const result3 = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result1).toBe(true);
      expect(result2).toBe(true);
      expect(result3).toBe(true);
      expect(mockExecutionContext.switchToHttp).toHaveBeenCalledTimes(3);
    });
  });

  describe('Error message validation', () => {
    it('should throw exception with correct message from systemMessage', () => {
      mockRequest.user = {
        email: 'message.test@example.com',
        permission: 'unauthorized',
        id: '123',
      };

      try {
        guard.canActivate(mockExecutionContext as ExecutionContext);
        fail('Expected ForbiddenException to be thrown');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect((error as Error).message).toBe(systemMessage.ReturnMessage.NotAcess);
      }
    });
  });

  describe('Performance tests', () => {
    it('should execute efficiently for valid admin permission', () => {
      mockRequest.user = {
        email: 'performance.admin@example.com',
        permission: 'admin',
        id: '123',
      };
      const startTime = Date.now();

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);
      const endTime = Date.now();

      expect(result).toBe(true);
      expect(endTime - startTime).toBeLessThan(10);
    });

    it('should handle concurrent access attempts', () => {
      const contexts = Array.from({ length: 50 }, () => ({
        ...mockExecutionContext,
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            user: {
              email: 'concurrent.admin@example.com',
              permission: 'admin',
            },
          }),
        }),
      }));

      const results = contexts.map((context) => guard.canActivate(context as ExecutionContext));

      expect(results).toHaveLength(50);
      results.forEach((result) => {
        expect(result).toBe(true);
      });
    });

    it('should maintain state independence between calls', () => {
      mockRequest.user = { email: 'admin1@example.com', permission: 'admin', id: '123' };
      const result1 = guard.canActivate(mockExecutionContext as ExecutionContext);

      mockRequest.user = { email: 'student@example.com', permission: 'student', id: '123' };

      mockRequest.user = { email: 'admin2@example.com', permission: 'admin', id: '123' };
      const result3 = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result1).toBe(true);
      expect(() => {
        mockRequest.user = { email: 'student@example.com', permission: 'student', id: '123' };
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(ForbiddenException);
      expect(result3).toBe(true);
    });
  });

  describe('Type safety', () => {
    it('should work with properly typed JwtPayload', () => {
      const typedUser: JwtPayload = {
        email: 'typed.admin@example.com',
        permission: 'admin',
        id: '123',
      };
      mockRequest.user = typedUser;

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result).toBe(true);
      expect(typeof mockRequest.user.email).toBe('string');
      expect(typeof mockRequest.user.permission).toBe('string');
    });

    it('should enforce strict admin permission requirement', () => {
      const permissions = ['admin'];
      const invalidPermissions = ['student', 'user', 'teacher', 'moderator', 'guest'];

      permissions.forEach((permission) => {
        mockRequest.user = {
          email: `${permission}@example.com`,
          permission,
          id: '123',
        };
        const result = guard.canActivate(mockExecutionContext as ExecutionContext);
        expect(result).toBe(true);
      });

      invalidPermissions.forEach((permission) => {
        mockRequest.user = {
          email: `${permission}@example.com`,
          permission,
          id: '123',
        };
        expect(() => {
          guard.canActivate(mockExecutionContext as ExecutionContext);
        }).toThrow(ForbiddenException);
      });
    });
  });
});
