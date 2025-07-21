import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { RolesGuardProfessor } from './roles-professor.guard';
import { JwtPayload } from '../dtos/JwtPayload.dto';
import { systemMessage } from '@config/i18n/pt/systemMessage';

describe('RolesGuardProfessor', () => {
  let guard: RolesGuardProfessor;
  let mockReflector: Partial<Reflector>;
  let mockJwtService: Partial<JwtService>;
  let mockExecutionContext: Partial<ExecutionContext>;
  let mockRequest: { user: JwtPayload };

  beforeEach(async () => {
    mockReflector = {
      get: jest.fn(),
      getAllAndOverride: jest.fn(),
    };

    mockJwtService = {
      verify: jest.fn(),
      sign: jest.fn(),
    };

    mockRequest = {
      user: {
        email: 'admin@example.com',
        permission: 'admin',
        id: '123',
      },
    };

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn(),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    };

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
      // Arrange
      mockRequest.user = {
        email: 'admin@example.com',
        permission: 'admin',
        id: '123',
      };

      // Act
      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      // Assert
      expect(result).toBe(true);
      expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
    });

    it('should handle different email formats for admin users', () => {
      // Arrange
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

        // Act
        const result = guard.canActivate(mockExecutionContext as ExecutionContext);

        // Assert
        expect(result).toBe(true);
      });
    });

    it('should work with different admin user scenarios', () => {
      // Arrange
      const testCases = [
        { email: 'head.professor@university.edu', permission: 'admin', id: '123' },
        { email: 'dean@academic.institution.org', permission: 'admin', id: '123' },
        { email: 'coordinator@education.gov', permission: 'admin', id: '123' },
      ];

      testCases.forEach((userCase) => {
        mockRequest.user = userCase;

        // Act
        const result = guard.canActivate(mockExecutionContext as ExecutionContext);

        // Assert
        expect(result).toBe(true);
      });
    });
  });

  describe('canActivate - Error Cases', () => {
    it('should throw ForbiddenException for student permission', () => {
      // Arrange
      mockRequest.user = {
        email: 'student@example.com',
        permission: 'student',
        id: '123',
      };

      // Act & Assert
      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(ForbiddenException);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(systemMessage.ReturnMessage.NotAcess);
    });

    it('should throw ForbiddenException for user permission', () => {
      // Arrange
      mockRequest.user = {
        email: 'regular.user@example.com',
        permission: 'user',
        id: '123',
      };

      // Act & Assert
      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(ForbiddenException);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(systemMessage.ReturnMessage.NotAcess);
    });

    it('should throw ForbiddenException for teacher permission', () => {
      // Arrange
      mockRequest.user = {
        email: 'teacher@example.com',
        permission: 'teacher',
        id: '123',
      };

      // Act & Assert
      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(ForbiddenException);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(systemMessage.ReturnMessage.NotAcess);
    });

    it('should throw ForbiddenException for invalid permission', () => {
      // Arrange
      mockRequest.user = {
        email: 'invalid@example.com',
        permission: 'invalid_role',
        id: '123',
      };

      // Act & Assert
      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(ForbiddenException);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(systemMessage.ReturnMessage.NotAcess);
    });

    it('should throw ForbiddenException for empty permission', () => {
      // Arrange
      mockRequest.user = {
        email: 'empty@example.com',
        permission: '',
        id: '123',
      };

      // Act & Assert
      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(ForbiddenException);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(systemMessage.ReturnMessage.NotAcess);
    });

    it('should handle case sensitivity in permissions correctly', () => {
      // Arrange - testing uppercase/mixed case should fail
      const invalidPermissions = ['ADMIN', 'Admin', 'AdMiN', 'administrator'];

      invalidPermissions.forEach((permission) => {
        mockRequest.user = {
          email: 'case.test@example.com',
          permission,
          id: '123',
        };

        // Act & Assert
        expect(() => {
          guard.canActivate(mockExecutionContext as ExecutionContext);
        }).toThrow(ForbiddenException);
      });
    });

    it('should throw ForbiddenException for null permission', () => {
      // Arrange
      mockRequest.user = {
        email: 'null@example.com',
        permission: null as unknown as string,
        id: '123',
      };

      // Act & Assert
      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(ForbiddenException);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(systemMessage.ReturnMessage.NotAcess);
    });

    it('should throw ForbiddenException for undefined permission', () => {
      // Arrange
      mockRequest.user = {
        email: 'undefined@example.com',
        permission: undefined as unknown as string,
        id: '123',
      };

      // Act & Assert
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
      // Arrange
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

      // Act
      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      // Assert
      expect(switchToHttpSpy).toHaveBeenCalled();
      expect(getRequestSpy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should handle multiple consecutive calls correctly', () => {
      // Arrange
      mockRequest.user = {
        email: 'multiple.admin@example.com',
        permission: 'admin',
        id: '123',
      };

      // Act
      const result1 = guard.canActivate(mockExecutionContext as ExecutionContext);
      const result2 = guard.canActivate(mockExecutionContext as ExecutionContext);
      const result3 = guard.canActivate(mockExecutionContext as ExecutionContext);

      // Assert
      expect(result1).toBe(true);
      expect(result2).toBe(true);
      expect(result3).toBe(true);
      expect(mockExecutionContext.switchToHttp).toHaveBeenCalledTimes(3);
    });
  });

  describe('Error message validation', () => {
    it('should throw exception with correct message from systemMessage', () => {
      // Arrange
      mockRequest.user = {
        email: 'message.test@example.com',
        permission: 'unauthorized',
        id: '123',
      };

      // Act & Assert
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
      // Arrange
      mockRequest.user = {
        email: 'performance.admin@example.com',
        permission: 'admin',
        id: '123',
      };
      const startTime = Date.now();

      // Act
      const result = guard.canActivate(mockExecutionContext as ExecutionContext);
      const endTime = Date.now();

      // Assert
      expect(result).toBe(true);
      expect(endTime - startTime).toBeLessThan(10); // Should complete in less than 10ms
    });

    it('should handle concurrent access attempts', () => {
      // Arrange
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

      // Act
      const results = contexts.map((context) => guard.canActivate(context as ExecutionContext));

      // Assert
      expect(results).toHaveLength(50);
      results.forEach((result) => {
        expect(result).toBe(true);
      });
    });

    it('should maintain state independence between calls', () => {
      // First call with admin (should pass)
      mockRequest.user = { email: 'admin1@example.com', permission: 'admin', id: '123' };
      const result1 = guard.canActivate(mockExecutionContext as ExecutionContext);

      // Second call with student (should fail)
      mockRequest.user = { email: 'student@example.com', permission: 'student', id: '123' };

      // Third call with admin again (should pass)
      mockRequest.user = { email: 'admin2@example.com', permission: 'admin', id: '123' };
      const result3 = guard.canActivate(mockExecutionContext as ExecutionContext);

      // Assert
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
      // Arrange
      const typedUser: JwtPayload = {
        email: 'typed.admin@example.com',
        permission: 'admin',
        id: '123',
      };
      mockRequest.user = typedUser;

      // Act
      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      // Assert
      expect(result).toBe(true);
      expect(typeof mockRequest.user.email).toBe('string');
      expect(typeof mockRequest.user.permission).toBe('string');
    });

    it('should enforce strict admin permission requirement', () => {
      // Arrange
      const permissions = ['admin']; // Only admin should pass
      const invalidPermissions = ['student', 'user', 'teacher', 'moderator', 'guest'];

      // Act & Assert - Valid permission
      permissions.forEach((permission) => {
        mockRequest.user = {
          email: `${permission}@example.com`,
          permission,
          id: '123',
        };
        const result = guard.canActivate(mockExecutionContext as ExecutionContext);
        expect(result).toBe(true);
      });

      // Act & Assert - Invalid permissions
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
