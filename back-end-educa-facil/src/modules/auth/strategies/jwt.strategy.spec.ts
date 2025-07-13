import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { JwtStrategyUser } from './jwt.strategy';
import { JwtPayload } from '../dtos/JwtPayload.dto';
import { UserPermission } from '@modules/user/entities/enum/permission.enum';

describe('JwtStrategyUser', () => {
  let strategy: JwtStrategyUser;
  let mockConfigService: {
    get: jest.Mock;
  };

  beforeEach(async () => {
    // Mock do ConfigService
    mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategyUser,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategyUser>(JwtStrategyUser);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Inicialização', () => {
    it('should be defined', () => {
      expect(strategy).toBeDefined();
    });

    it('should have a logger instance', () => {
      expect(strategy['logger']).toBeInstanceOf(Logger);
      expect(strategy['logger']['context']).toBe('JwtStrategyUser');
    });

    it('should use default empty string when JWT_SECRET is not provided', () => {
      // Arrange
      mockConfigService.get.mockReturnValue(undefined);

      // Act
      const newStrategy = new JwtStrategyUser(mockConfigService as any);

      // Assert
      expect(mockConfigService.get).toHaveBeenCalledWith('JWT_SECRET', '');
      expect(newStrategy).toBeDefined();
    });

    it('should configure passport strategy with correct options', () => {
      // Arrange
      const testSecret = 'test-secret';
      mockConfigService.get.mockReturnValue(testSecret);

      // Act
      const newStrategy = new JwtStrategyUser(mockConfigService as any);

      // Assert
      // Verificamos que a estratégia foi configurada corretamente
      // (indiretamente através da instanciação bem-sucedida)
      expect(newStrategy).toBeDefined();
      expect(newStrategy.name).toBe('jwt-user');
    });
  });

  describe('validate', () => {
    const mockJwtPayload: JwtPayload = {
      email: 'test@example.com',
      permission: UserPermission.USER,
    };

    it('should validate and return the JWT payload successfully', async () => {
      // Act
      const result = await strategy.validate(mockJwtPayload);

      // Assert
      expect(result).toEqual({
        email: 'test@example.com',
        permission: UserPermission.USER,
      });
    });

    it('should validate admin user payload', async () => {
      // Arrange
      const adminPayload: JwtPayload = {
        email: 'admin@example.com',
        permission: UserPermission.ADMIN,
      };

      // Act
      const result = await strategy.validate(adminPayload);

      // Assert
      expect(result).toEqual({
        email: 'admin@example.com',
        permission: UserPermission.ADMIN,
      });
    });

    it('should preserve all payload properties', async () => {
      // Arrange
      const complexPayload: JwtPayload = {
        email: 'user+test@example.co.uk',
        permission: UserPermission.USER,
      };

      // Act
      const result = await strategy.validate(complexPayload);

      // Assert
      expect(result).toEqual(complexPayload);
      expect(result.email).toBe(complexPayload.email);
      expect(result.permission).toBe(complexPayload.permission);
    });

    it('should handle email with special characters', async () => {
      // Arrange
      const specialEmailPayload: JwtPayload = {
        email: 'user.name+tag@example-domain.co.uk',
        permission: UserPermission.USER,
      };

      // Act
      const result = await strategy.validate(specialEmailPayload);

      // Assert
      expect(result).toEqual(specialEmailPayload);
      expect(result.email).toBe('user.name+tag@example-domain.co.uk');
    });

    it('should handle empty email gracefully', async () => {
      // Arrange
      const emptyEmailPayload: JwtPayload = {
        email: '',
        permission: UserPermission.USER,
      };

      // Act
      const result = await strategy.validate(emptyEmailPayload);

      // Assert
      expect(result).toEqual(emptyEmailPayload);
      expect(result.email).toBe('');
    });

    it('should return a Promise that resolves to JwtPayload', async () => {
      // Act
      const result = strategy.validate(mockJwtPayload);

      // Assert
      expect(result).toBeInstanceOf(Promise);

      const resolvedResult = await result;
      expect(resolvedResult).toEqual(mockJwtPayload);
    });

    it('should maintain payload structure exactly', async () => {
      // Arrange
      const originalPayload: JwtPayload = {
        email: 'test@example.com',
        permission: UserPermission.ADMIN,
      };

      // Act
      const result = await strategy.validate(originalPayload);

      // Assert
      expect(result).toStrictEqual(originalPayload);
      expect(Object.keys(result)).toEqual(Object.keys(originalPayload));
    });

    it('should handle null values in payload gracefully', async () => {
      // Arrange
      const nullPayload = {
        email: null,
        permission: UserPermission.USER,
      } as unknown as JwtPayload;

      // Act
      const result = await strategy.validate(nullPayload);

      // Assert
      expect(result).toEqual(nullPayload);
      expect(result.email).toBeNull();
    });

    it('should handle undefined values in payload gracefully', async () => {
      // Arrange
      const undefinedPayload = {
        email: undefined,
        permission: UserPermission.USER,
      } as unknown as JwtPayload;

      // Act
      const result = await strategy.validate(undefinedPayload);

      // Assert
      expect(result).toEqual(undefinedPayload);
      expect(result.email).toBeUndefined();
    });
  });

  describe('Strategy Configuration', () => {
    it('should be configured with correct strategy name', () => {
      expect(strategy.name).toBe('jwt-user');
    });

    it('should have correct authentication type', () => {
      // Verificamos que a estratégia está configurada como JWT
      expect(strategy).toHaveProperty('authenticate');
      expect(typeof strategy.authenticate).toBe('function');
    });
  });

  describe('ConfigService Integration', () => {
    it('should call configService.get with correct parameters', () => {
      // Arrange
      const testSecret = 'integration-test-secret';
      mockConfigService.get.mockReturnValue(testSecret);

      // Act
      new JwtStrategyUser(mockConfigService as any);

      // Assert
      expect(mockConfigService.get).toHaveBeenCalledWith('JWT_SECRET', '');
      expect(mockConfigService.get).toHaveBeenCalledTimes(1);
    });

    it('should handle configService returning empty string', () => {
      // Arrange
      mockConfigService.get.mockReturnValue('');

      // Act & Assert
      expect(() => new JwtStrategyUser(mockConfigService as any)).not.toThrow();
    });

    it('should handle configService returning null', () => {
      // Arrange
      mockConfigService.get.mockReturnValue(null);

      // Act & Assert
      expect(() => new JwtStrategyUser(mockConfigService as any)).not.toThrow();
    });

    it('should handle configService throwing an error', () => {
      // Arrange
      mockConfigService.get.mockImplementation(() => {
        throw new Error('Config error');
      });

      // Act & Assert
      expect(() => new JwtStrategyUser(mockConfigService as any)).toThrow('Config error');
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed payload objects', async () => {
      // Arrange
      const malformedPayload = {
        email: 'test@example.com',
        // permission is missing
      } as any;

      // Act
      const result = await strategy.validate(malformedPayload);

      // Assert
      expect(result).toEqual({
        email: 'test@example.com',
        permission: undefined,
      });
    });

    it('should handle payload with extra properties', async () => {
      // Arrange
      const payloadWithExtras = {
        email: 'test@example.com',
        permission: UserPermission.USER,
        extraField: 'should be ignored',
      } as any;

      // Act
      const result = await strategy.validate(payloadWithExtras);

      // Assert
      expect(result).toEqual({
        email: 'test@example.com',
        permission: UserPermission.USER,
      });
      expect(result).not.toHaveProperty('extraField');
    });
  });

  describe('Performance and Reliability', () => {
    it('should handle multiple concurrent validations', async () => {
      // Arrange
      const payloads: JwtPayload[] = [
        { email: 'user1@example.com', permission: UserPermission.USER },
        { email: 'user2@example.com', permission: UserPermission.ADMIN },
        { email: 'user3@example.com', permission: UserPermission.USER },
      ];

      // Act
      const promises = payloads.map((payload) => strategy.validate(payload));
      const results = await Promise.all(promises);

      // Assert
      expect(results).toHaveLength(3);
      results.forEach((result, index) => {
        expect(result).toEqual(payloads[index]);
      });
    });

    it('should be performant with large number of validations', async () => {
      // Arrange
      const payload: JwtPayload = {
        email: 'performance@example.com',
        permission: UserPermission.USER,
      };

      const validationPromises = Array(1000)
        .fill(null)
        .map(() => strategy.validate(payload));

      // Act
      const start = Date.now();
      const results = await Promise.all(validationPromises);
      const duration = Date.now() - start;

      // Assert
      expect(results).toHaveLength(1000);
      expect(duration).toBeLessThan(1000); // Should complete in less than 1 second
      results.forEach((result) => {
        expect(result).toEqual(payload);
      });
    });

    it('should maintain consistent behavior across multiple calls', async () => {
      // Arrange
      const payload: JwtPayload = {
        email: 'consistent@example.com',
        permission: UserPermission.ADMIN,
      };

      // Act
      const results = await Promise.all([
        strategy.validate(payload),
        strategy.validate(payload),
        strategy.validate(payload),
      ]);

      // Assert
      results.forEach((result) => {
        expect(result).toEqual(payload);
        expect(result).toStrictEqual(results[0]);
      });
    });
  });

  describe('Type Safety', () => {
    it('should maintain type safety for JwtPayload', async () => {
      // Arrange
      const typedPayload: JwtPayload = {
        email: 'typed@example.com',
        permission: UserPermission.USER,
      };

      // Act
      const result = await strategy.validate(typedPayload);

      // Assert
      expect(typeof result.email).toBe('string');
      expect(typeof result.permission).toBe('string');
      expect(Object.values(UserPermission)).toContain(result.permission);
    });

    it('should handle all UserPermission enum values', async () => {
      // Arrange & Act & Assert
      for (const permission of Object.values(UserPermission)) {
        const payload: JwtPayload = {
          email: `test@${permission}.com`,
          permission: permission,
        };

        const result = await strategy.validate(payload);

        expect(result.permission).toBe(permission);
        expect(Object.values(UserPermission)).toContain(result.permission);
      }
    });
  });
});
