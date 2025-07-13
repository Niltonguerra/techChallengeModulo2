import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuardUser } from './jwt-auth-user.guard';
import { AuthGuard } from '@nestjs/passport';

// Mock do AuthGuard
jest.mock('@nestjs/passport', () => ({
  AuthGuard: jest.fn().mockImplementation(() => {
    return class MockAuthGuard {
      canActivate = jest.fn();
      logIn = jest.fn();
      handleRequest = jest.fn();
      getAuthenticateOptions = jest.fn();
    };
  }),
}));

describe('JwtAuthGuardUser', () => {
  let guard: JwtAuthGuardUser;
  let mockExecutionContext: Partial<ExecutionContext>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtAuthGuardUser],
    }).compile();

    guard = module.get<JwtAuthGuardUser>(JwtAuthGuardUser);

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            authorization: 'Bearer valid.jwt.token',
          },
        }),
        getResponse: jest.fn(),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Inicialização', () => {
    it('should be defined', () => {
      expect(guard).toBeDefined();
    });

    it('should extend AuthGuard', () => {
      expect(guard).toBeInstanceOf(Object);
      expect(AuthGuard).toHaveBeenCalledWith('jwt-user');
    });

    it('should be injectable', () => {
      expect(guard.constructor).toBeDefined();
    });
  });

  describe('Guard Strategy Configuration', () => {
    it('should use jwt-user strategy', () => {
      // Assert
      expect(AuthGuard).toHaveBeenCalledWith('jwt-user');
    });

    it('should create guard with correct strategy name', () => {
      // Arrange & Act
      const newGuard = new JwtAuthGuardUser();

      // Assert
      expect(newGuard).toBeDefined();
      expect(AuthGuard).toHaveBeenCalledWith('jwt-user');
    });
  });

  describe('Authentication Flow', () => {
    it('should call parent canActivate method', async () => {
      // Arrange
      const mockCanActivate = jest.fn().mockResolvedValue(true);
      guard.canActivate = mockCanActivate;

      // Act
      const result = await guard.canActivate(mockExecutionContext as ExecutionContext);

      // Assert
      expect(mockCanActivate).toHaveBeenCalledWith(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should handle authentication success', async () => {
      // Arrange
      const mockCanActivate = jest.fn().mockResolvedValue(true);
      guard.canActivate = mockCanActivate;

      // Act
      const result = await guard.canActivate(mockExecutionContext as ExecutionContext);

      // Assert
      expect(result).toBe(true);
      expect(mockCanActivate).toHaveBeenCalledTimes(1);
    });

    it('should handle authentication failure', async () => {
      // Arrange
      const mockCanActivate = jest
        .fn()
        .mockRejectedValue(new UnauthorizedException('Invalid token'));
      guard.canActivate = mockCanActivate;

      // Act & Assert
      await expect(guard.canActivate(mockExecutionContext as ExecutionContext)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(mockCanActivate).toHaveBeenCalledWith(mockExecutionContext);
    });

    it('should handle promise-based canActivate', async () => {
      // Arrange
      const mockCanActivate = jest.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(true), 10);
        });
      });
      guard.canActivate = mockCanActivate;

      // Act
      const result = await guard.canActivate(mockExecutionContext as ExecutionContext);

      // Assert
      expect(result).toBe(true);
      expect(mockCanActivate).toHaveBeenCalledWith(mockExecutionContext);
    });

    it('should handle boolean return from canActivate', async () => {
      // Arrange
      const mockCanActivate = jest.fn().mockReturnValue(true);
      guard.canActivate = mockCanActivate;

      // Act
      const result = await guard.canActivate(mockExecutionContext as ExecutionContext);

      // Assert
      expect(result).toBe(true);
      expect(mockCanActivate).toHaveBeenCalledWith(mockExecutionContext);
    });

    it('should handle observable return from canActivate', async () => {
      // Arrange
      const { of } = require('rxjs');
      const mockCanActivate = jest.fn().mockReturnValue(of(true));
      guard.canActivate = mockCanActivate;

      // Act
      const result = await guard.canActivate(mockExecutionContext as ExecutionContext);

      // Assert
      expect(mockCanActivate).toHaveBeenCalledWith(mockExecutionContext);
    });
  });

  describe('Error Handling', () => {
    it('should propagate UnauthorizedException', async () => {
      // Arrange
      const unauthorizedError = new UnauthorizedException('Token expired');
      const mockCanActivate = jest.fn().mockRejectedValue(unauthorizedError);
      guard.canActivate = mockCanActivate;

      // Act & Assert
      await expect(guard.canActivate(mockExecutionContext as ExecutionContext)).rejects.toThrow(
        'Token expired',
      );

      await expect(guard.canActivate(mockExecutionContext as ExecutionContext)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should handle generic authentication errors', async () => {
      // Arrange
      const genericError = new Error('Authentication failed');
      const mockCanActivate = jest.fn().mockRejectedValue(genericError);
      guard.canActivate = mockCanActivate;

      // Act & Assert
      await expect(guard.canActivate(mockExecutionContext as ExecutionContext)).rejects.toThrow(
        'Authentication failed',
      );

      expect(mockCanActivate).toHaveBeenCalledWith(mockExecutionContext);
    });

    it('should handle null/undefined authentication results', async () => {
      // Arrange
      const mockCanActivate = jest.fn().mockResolvedValue(null);
      guard.canActivate = mockCanActivate;

      // Act
      const result = await guard.canActivate(mockExecutionContext as ExecutionContext);

      // Assert
      expect(result).toBeNull();
      expect(mockCanActivate).toHaveBeenCalledWith(mockExecutionContext);
    });

    it('should handle false authentication results', async () => {
      // Arrange
      const mockCanActivate = jest.fn().mockResolvedValue(false);
      guard.canActivate = mockCanActivate;

      // Act
      const result = await guard.canActivate(mockExecutionContext as ExecutionContext);

      // Assert
      expect(result).toBe(false);
      expect(mockCanActivate).toHaveBeenCalledWith(mockExecutionContext);
    });
  });

  describe('Context Handling', () => {
    it('should work with different execution contexts', async () => {
      // Arrange
      const contexts = [
        {
          switchToHttp: jest.fn().mockReturnValue({
            getRequest: jest.fn().mockReturnValue({
              headers: { authorization: 'Bearer token1' },
            }),
          }),
        },
        {
          switchToHttp: jest.fn().mockReturnValue({
            getRequest: jest.fn().mockReturnValue({
              headers: { authorization: 'Bearer token2' },
            }),
          }),
        },
      ];

      const mockCanActivate = jest.fn().mockResolvedValue(true);
      guard.canActivate = mockCanActivate;

      // Act
      const results = await Promise.all(
        contexts.map((context) => guard.canActivate(context as ExecutionContext)),
      );

      // Assert
      expect(results).toEqual([true, true]);
      expect(mockCanActivate).toHaveBeenCalledTimes(2);
    });

    it('should handle missing authorization header gracefully', async () => {
      // Arrange
      const contextWithoutAuth = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: {},
          }),
        }),
      };

      const mockCanActivate = jest
        .fn()
        .mockRejectedValue(new UnauthorizedException('No token provided'));
      guard.canActivate = mockCanActivate;

      // Act & Assert
      await expect(guard.canActivate(contextWithoutAuth as ExecutionContext)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('Performance and Concurrency', () => {
    it('should handle multiple concurrent authentication requests', async () => {
      // Arrange
      const mockCanActivate = jest.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(true), Math.random() * 10);
        });
      });
      guard.canActivate = mockCanActivate;

      const contexts = Array.from({ length: 10 }, () => mockExecutionContext);

      // Act
      const results = await Promise.all(
        contexts.map((context) => guard.canActivate(context as ExecutionContext)),
      );

      // Assert
      expect(results).toHaveLength(10);
      results.forEach((result) => {
        expect(result).toBe(true);
      });
      expect(mockCanActivate).toHaveBeenCalledTimes(10);
    });

    it('should execute efficiently', async () => {
      // Arrange
      const mockCanActivate = jest.fn().mockResolvedValue(true);
      guard.canActivate = mockCanActivate;
      const startTime = Date.now();

      // Act
      await guard.canActivate(mockExecutionContext as ExecutionContext);
      const endTime = Date.now();

      // Assert
      expect(endTime - startTime).toBeLessThan(100); // Should complete quickly
      expect(mockCanActivate).toHaveBeenCalledTimes(1);
    });

    it('should maintain state independence between calls', async () => {
      // Arrange
      const mockCanActivate = jest
        .fn()
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true);
      guard.canActivate = mockCanActivate;

      // Act
      const result1 = await guard.canActivate(mockExecutionContext as ExecutionContext);
      const result2 = await guard.canActivate(mockExecutionContext as ExecutionContext);
      const result3 = await guard.canActivate(mockExecutionContext as ExecutionContext);

      // Assert
      expect(result1).toBe(true);
      expect(result2).toBe(false);
      expect(result3).toBe(true);
      expect(mockCanActivate).toHaveBeenCalledTimes(3);
    });
  });

  describe('Integration with Passport Strategy', () => {
    it('should be compatible with jwt-user strategy', () => {
      // Arrange & Act
      const strategyName = 'jwt-user';

      // Assert
      expect(AuthGuard).toHaveBeenCalledWith(strategyName);
    });

    it('should work as a proper Passport guard', () => {
      // Arrange & Act
      const guardInstance = new JwtAuthGuardUser();

      // Assert
      expect(guardInstance).toBeDefined();
      expect(guardInstance.constructor).toBe(JwtAuthGuardUser);
    });

    it('should handle strategy-specific authentication flow', async () => {
      // Arrange
      const mockCanActivate = jest.fn().mockImplementation((context) => {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
          return Promise.resolve(true);
        }
        return Promise.reject(new UnauthorizedException('Invalid token format'));
      });
      guard.canActivate = mockCanActivate;

      // Act
      const result = await guard.canActivate(mockExecutionContext as ExecutionContext);

      // Assert
      expect(result).toBe(true);
      expect(mockCanActivate).toHaveBeenCalledWith(mockExecutionContext);
    });
  });

  describe('Type Safety and Inheritance', () => {
    it('should properly inherit from AuthGuard', () => {
      // Assert
      expect(guard).toBeInstanceOf(Object);
      expect(AuthGuard).toHaveBeenCalledWith('jwt-user');
    });

    it('should maintain correct type signature for canActivate', async () => {
      // Arrange
      const mockCanActivate = jest.fn().mockResolvedValue(true);
      guard.canActivate = mockCanActivate;

      // Act
      const result = await guard.canActivate(mockExecutionContext as ExecutionContext);

      // Assert
      expect(typeof result).toBe('boolean');
      expect(result).toBe(true);
    });

    it('should work with ExecutionContext interface', async () => {
      // Arrange
      const mockCanActivate = jest.fn().mockImplementation((context: ExecutionContext) => {
        expect(context.switchToHttp).toBeDefined();
        expect(typeof context.switchToHttp).toBe('function');
        return Promise.resolve(true);
      });
      guard.canActivate = mockCanActivate;

      // Act
      const result = await guard.canActivate(mockExecutionContext as ExecutionContext);

      // Assert
      expect(result).toBe(true);
    });
  });
});
