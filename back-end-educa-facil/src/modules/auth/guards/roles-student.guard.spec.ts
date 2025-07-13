import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { RolesGuardStudent } from './roles-student.guard';
import { JwtPayload } from '../dtos/JwtPayload.dto';
import { systemMessage } from '@config/i18n/pt/systemMessage';

describe('RolesGuardStudent', () => {
  let guard: RolesGuardStudent;
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
        email: 'test@example.com',
        permission: 'student',
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
        RolesGuardStudent,
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

    guard = module.get<RolesGuardStudent>(RolesGuardStudent);
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
      expect(guard['logger']['context']).toBe('RolesGuardStudent');
    });

    it('should have reflector and jwtService injected', () => {
      expect(guard['reflector']).toBeDefined();
      expect(guard['jwtService']).toBeDefined();
    });
  });

  describe('canActivate - Success Cases', () => {
    it('should return true for user with student permission', () => {
      // Arrange
      mockRequest.user = {
        email: 'student@example.com',
        permission: 'student',
      };

      // Act
      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      // Assert
      expect(result).toBe(true);
      expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
    });

    it('should return true for user with admin permission', () => {
      // Arrange
      mockRequest.user = {
        email: 'admin@example.com',
        permission: 'admin',
      };

      // Act
      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      // Assert
      expect(result).toBe(true);
      expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
    });

    it('should handle different email formats for student users', () => {
      // Arrange
      const testCases = [
        'student1@university.edu',
        'test+student@example.com',
        'student.name@domain.co.uk',
        'very.long.email.address.for.student@university.education.org',
      ];

      testCases.forEach((email) => {
        mockRequest.user = {
          email,
          permission: 'student',
        };

        // Act
        const result = guard.canActivate(mockExecutionContext as ExecutionContext);

        // Assert
        expect(result).toBe(true);
      });
    });

    it('should handle different email formats for admin users', () => {
      // Arrange
      const testCases = ['admin@company.com', 'system.admin@domain.org', 'super+admin@example.net'];

      testCases.forEach((email) => {
        mockRequest.user = {
          email,
          permission: 'admin',
        };

        // Act
        const result = guard.canActivate(mockExecutionContext as ExecutionContext);

        // Assert
        expect(result).toBe(true);
      });
    });
  });

  describe('canActivate - Error Cases', () => {
    it('should throw ForbiddenException for user permission', () => {
      // Arrange
      mockRequest.user = {
        email: 'user@example.com',
        permission: 'user',
      };

      // Act & Assert
      expect(() => guard.canActivate(mockExecutionContext as ExecutionContext)).toThrow(
        ForbiddenException,
      );
      expect(() => guard.canActivate(mockExecutionContext as ExecutionContext)).toThrow(
        systemMessage.ReturnMessage.NotAcess,
      );
    });

    it('should throw ForbiddenException for teacher permission', () => {
      // Arrange
      mockRequest.user = {
        email: 'teacher@example.com',
        permission: 'teacher',
      };

      // Act & Assert
      expect(() => guard.canActivate(mockExecutionContext as ExecutionContext)).toThrow(
        ForbiddenException,
      );
      expect(() => guard.canActivate(mockExecutionContext as ExecutionContext)).toThrow(
        systemMessage.ReturnMessage.NotAcess,
      );
    });

    it('should throw ForbiddenException for invalid permission', () => {
      // Arrange
      mockRequest.user = {
        email: 'invalid@example.com',
        permission: 'invalid_permission',
      };

      // Act & Assert
      expect(() => guard.canActivate(mockExecutionContext as ExecutionContext)).toThrow(
        ForbiddenException,
      );
      expect(() => guard.canActivate(mockExecutionContext as ExecutionContext)).toThrow(
        systemMessage.ReturnMessage.NotAcess,
      );
    });

    it('should throw ForbiddenException for empty permission', () => {
      // Arrange
      mockRequest.user = {
        email: 'empty@example.com',
        permission: '',
      };

      // Act & Assert
      expect(() => guard.canActivate(mockExecutionContext as ExecutionContext)).toThrow(
        ForbiddenException,
      );
      expect(() => guard.canActivate(mockExecutionContext as ExecutionContext)).toThrow(
        systemMessage.ReturnMessage.NotAcess,
      );
    });

    it('should throw ForbiddenException for null permission', () => {
      // Arrange
      mockRequest.user = {
        email: 'null@example.com',
        permission: null as any,
      };

      // Act & Assert
      expect(() => guard.canActivate(mockExecutionContext as ExecutionContext)).toThrow(
        ForbiddenException,
      );
      expect(() => guard.canActivate(mockExecutionContext as ExecutionContext)).toThrow(
        systemMessage.ReturnMessage.NotAcess,
      );
    });

    it('should throw ForbiddenException for undefined permission', () => {
      // Arrange
      mockRequest.user = {
        email: 'undefined@example.com',
        permission: undefined as any,
      };

      // Act & Assert
      expect(() => guard.canActivate(mockExecutionContext as ExecutionContext)).toThrow(
        ForbiddenException,
      );
      expect(() => guard.canActivate(mockExecutionContext as ExecutionContext)).toThrow(
        systemMessage.ReturnMessage.NotAcess,
      );
    });

    it('should handle case sensitivity in permissions correctly', () => {
      // Arrange - testing uppercase permissions should fail
      const invalidPermissions = ['STUDENT', 'ADMIN', 'Student', 'Admin'];

      invalidPermissions.forEach((permission) => {
        mockRequest.user = {
          email: 'case@example.com',
          permission: permission as any,
        };

        // Act & Assert
        expect(() => guard.canActivate(mockExecutionContext as ExecutionContext)).toThrow(
          ForbiddenException,
        );
      });
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
        email: 'context@example.com',
        permission: 'student',
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
        email: 'multiple@example.com',
        permission: 'admin',
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
        email: 'message@example.com',
        permission: 'unauthorized',
      };

      // Act & Assert
      try {
        guard.canActivate(mockExecutionContext as ExecutionContext);
        fail('Expected ForbiddenException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe(systemMessage.ReturnMessage.NotAcess);
      }
    });
  });

  describe('Performance and edge cases', () => {
    it('should execute efficiently for valid permissions', () => {
      // Arrange
      mockRequest.user = {
        email: 'performance@example.com',
        permission: 'student',
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
      const contexts = Array.from({ length: 100 }, () => ({
        ...mockExecutionContext,
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            user: {
              email: 'concurrent@example.com',
              permission: 'student',
            },
          }),
        }),
      }));

      // Act
      const results = contexts.map((context) => guard.canActivate(context as ExecutionContext));

      // Assert
      expect(results).toHaveLength(100);
      results.forEach((result) => {
        expect(result).toBe(true);
      });
    });

    it('should maintain state independence between calls', () => {
      // Arrange & Act
      // First call with student
      mockRequest.user = { email: 'test1@example.com', permission: 'student' };
      const result1 = guard.canActivate(mockExecutionContext as ExecutionContext);

      // Second call with admin
      mockRequest.user = { email: 'test2@example.com', permission: 'admin' };
      const result2 = guard.canActivate(mockExecutionContext as ExecutionContext);

      // Third call with invalid permission (should throw)
      mockRequest.user = { email: 'test3@example.com', permission: 'invalid' };

      // Assert
      expect(result1).toBe(true);
      expect(result2).toBe(true);
      expect(() => guard.canActivate(mockExecutionContext as ExecutionContext)).toThrow(
        ForbiddenException,
      );
    });
  });

  describe('Type safety', () => {
    it('should work with properly typed JwtPayload', () => {
      // Arrange
      const typedUser: JwtPayload = {
        email: 'typed@example.com',
        permission: 'student',
      };
      mockRequest.user = typedUser;

      // Act
      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      // Assert
      expect(result).toBe(true);
      expect(typeof mockRequest.user.email).toBe('string');
      expect(typeof mockRequest.user.permission).toBe('string');
    });
  });
});
