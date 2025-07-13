import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HashPasswordPipe } from './passwordEncryption.pipe';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import * as bcrypt from 'bcrypt';

// Mock do bcrypt
jest.mock('bcrypt');

describe('HashPasswordPipe', () => {
  let pipe: HashPasswordPipe;
  let mockConfigService: Partial<ConfigService>;
  let mockBcrypt: jest.Mocked<typeof bcrypt>;

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn(),
    };

    mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HashPasswordPipe,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    pipe = module.get<HashPasswordPipe>(HashPasswordPipe);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Inicialização', () => {
    it('should be defined', () => {
      expect(pipe).toBeDefined();
    });

    it('should have a logger instance', () => {
      expect(pipe['logger']).toBeInstanceOf(Logger);
      expect(pipe['logger']['context']).toBe('HashPasswordPipe');
    });

    it('should initialize with saltRounds as 10', () => {
      expect(pipe['saltRounds']).toBe(10);
    });
  });

  describe('transform method - Success Cases', () => {
    beforeEach(() => {
      mockBcrypt.hash.mockResolvedValue('$2b$10$hashedPassword123' as never);
    });

    it('should hash a valid password successfully', async () => {
      // Arrange
      const input = { password: 'validPassword123' };
      const expectedOutput = {
        password: '$2b$10$hashedPassword123',
      };

      // Act
      const result = await pipe.transform(input);

      // Assert
      expect(mockBcrypt.hash).toHaveBeenCalledWith('validPassword123', 10);
      expect(result).toEqual(expectedOutput);
    });

    it('should preserve other properties while hashing password', async () => {
      // Arrange
      const input = {
        password: 'validPassword123',
        email: 'test@example.com',
        name: 'Test User',
      };
      const expectedOutput = {
        password: '$2b$10$hashedPassword123',
        email: 'test@example.com',
        name: 'Test User',
      };

      // Act
      const result = await pipe.transform(input);

      // Assert
      expect(mockBcrypt.hash).toHaveBeenCalledWith('validPassword123', 10);
      expect(result).toEqual(expectedOutput);
    });

    it('should handle password with special characters', async () => {
      // Arrange
      const input = { password: 'P@ssw0rd!@#$%^&*()' };

      // Act
      const result = await pipe.transform(input);

      // Assert
      expect(mockBcrypt.hash).toHaveBeenCalledWith('P@ssw0rd!@#$%^&*()', 10);
      expect(result.password).toBe('$2b$10$hashedPassword123');
    });

    it('should handle very long passwords', async () => {
      // Arrange
      const longPassword = 'a'.repeat(200);
      const input = { password: longPassword };

      // Act
      const result = await pipe.transform(input);

      // Assert
      expect(mockBcrypt.hash).toHaveBeenCalledWith(longPassword, 10);
      expect(result.password).toBe('$2b$10$hashedPassword123');
    });

    it('should handle password with leading and trailing spaces', async () => {
      // Arrange
      const input = { password: '  validPassword123  ' };

      // Act
      const result = await pipe.transform(input);

      // Assert
      expect(mockBcrypt.hash).toHaveBeenCalledWith('  validPassword123  ', 10);
      expect(result.password).toBe('$2b$10$hashedPassword123');
    });

    it('should handle unicode characters in password', async () => {
      // Arrange
      const input = { password: 'password123_ção_ñ_漢字' };

      // Act
      const result = await pipe.transform(input);

      // Assert
      expect(mockBcrypt.hash).toHaveBeenCalledWith('password123_ção_ñ_漢字', 10);
      expect(result.password).toBe('$2b$10$hashedPassword123');
    });
  });

  describe('transform method - Error Cases', () => {
    it('should throw BadRequestException when value is null', async () => {
      // Arrange
      const input = null;

      // Act & Assert
      await expect(pipe.transform(input as unknown as { password?: string })).rejects.toThrow(
        BadRequestException,
      );
      await expect(pipe.transform(input as unknown as { password?: string })).rejects.toThrow(
        systemMessage.ReturnMessage.isObject,
      );
    });

    it('should throw BadRequestException when value is undefined', async () => {
      // Arrange
      const input = undefined;

      // Act & Assert
      await expect(pipe.transform(input)).rejects.toThrow(BadRequestException);
      await expect(pipe.transform(input)).rejects.toThrow(systemMessage.ReturnMessage.isObject);
    });

    it('should throw BadRequestException when value is not an object', async () => {
      // Arrange
      const input = 'not an object';

      // Act & Assert
      await expect(pipe.transform(input as unknown as { password?: string })).rejects.toThrow(
        BadRequestException,
      );
      await expect(pipe.transform(input as unknown as { password?: string })).rejects.toThrow(
        systemMessage.ReturnMessage.isObject,
      );
    });

    it('should throw BadRequestException when password is missing', async () => {
      // Arrange
      const input = { email: 'test@example.com' };

      // Act & Assert
      await expect(pipe.transform(input)).rejects.toThrow(BadRequestException);
      await expect(pipe.transform(input)).rejects.toThrow(
        systemMessage.ReturnMessage.isnotEmptyPassword,
      );
    });

    it('should throw BadRequestException when password is null', async () => {
      // Arrange
      const input = { password: null };

      // Act & Assert
      await expect(pipe.transform(input as unknown as { password?: string })).rejects.toThrow(
        BadRequestException,
      );
      await expect(pipe.transform(input as unknown as { password?: string })).rejects.toThrow(
        systemMessage.ReturnMessage.isnotEmptyPassword,
      );
    });

    it('should throw BadRequestException when password is undefined', async () => {
      // Arrange
      const input = { password: undefined };

      // Act & Assert
      await expect(pipe.transform(input)).rejects.toThrow(BadRequestException);
      await expect(pipe.transform(input)).rejects.toThrow(
        systemMessage.ReturnMessage.isnotEmptyPassword,
      );
    });

    it('should throw BadRequestException when password is not a string', async () => {
      // Arrange
      const input = { password: 123 };

      // Act & Assert
      await expect(pipe.transform(input as unknown as { password?: string })).rejects.toThrow(
        BadRequestException,
      );
      await expect(pipe.transform(input as unknown as { password?: string })).rejects.toThrow(
        systemMessage.ReturnMessage.isnotEmptyPassword,
      );
    });

    it('should throw BadRequestException when password is empty string', async () => {
      // Arrange
      const input = { password: '' };

      // Act & Assert
      await expect(pipe.transform(input)).rejects.toThrow(BadRequestException);
      await expect(pipe.transform(input)).rejects.toThrow(
        systemMessage.ReturnMessage.isnotEmptyPassword,
      );
    });

    it('should throw BadRequestException when password is only whitespace', async () => {
      // Arrange
      const input = { password: '   ' };

      // Act & Assert
      await expect(pipe.transform(input)).rejects.toThrow(BadRequestException);
      await expect(pipe.transform(input)).rejects.toThrow(
        systemMessage.ReturnMessage.isnotEmptyPassword,
      );
    });

    it('should throw BadRequestException when password is only tabs and newlines', async () => {
      // Arrange
      const input = { password: '\t\n\r' };

      // Act & Assert
      await expect(pipe.transform(input)).rejects.toThrow(BadRequestException);
      await expect(pipe.transform(input)).rejects.toThrow(
        systemMessage.ReturnMessage.isnotEmptyPassword,
      );
    });
  });

  describe('bcrypt error handling', () => {
    it('should throw BadRequestException when bcrypt.hash fails', async () => {
      // Arrange
      const input = { password: 'validPassword123' };
      const bcryptError = new Error('Bcrypt failed');
      mockBcrypt.hash.mockRejectedValue(bcryptError);

      // Spy no logger
      const loggerSpy = jest.spyOn(pipe['logger'], 'error');

      // Act & Assert
      await expect(pipe.transform(input)).rejects.toThrow(BadRequestException);
      await expect(pipe.transform(input)).rejects.toThrow(
        systemMessage.ReturnMessage.FailedToProcessPassword,
      );

      expect(loggerSpy).toHaveBeenCalledWith('Error ao processar a senha:', bcryptError);
    });

    it('should log error details when bcrypt fails', async () => {
      // Arrange
      const input = { password: 'validPassword123' };
      const bcryptError = new Error('Hash generation failed');
      mockBcrypt.hash.mockRejectedValue(bcryptError);

      // Spy no logger
      const loggerSpy = jest.spyOn(pipe['logger'], 'error');

      // Act
      try {
        await pipe.transform(input);
      } catch (error) {
        // Expected error
      }

      // Assert
      expect(loggerSpy).toHaveBeenCalledTimes(1);
      expect(loggerSpy).toHaveBeenCalledWith('Error ao processar a senha:', bcryptError);
    });

    it('should handle different types of bcrypt errors', async () => {
      // Arrange
      const input = { password: 'validPassword123' };
      const customError = new TypeError('Invalid salt rounds');
      mockBcrypt.hash.mockRejectedValue(customError);

      // Spy no logger
      const loggerSpy = jest.spyOn(pipe['logger'], 'error');

      // Act & Assert
      await expect(pipe.transform(input)).rejects.toThrow(BadRequestException);
      expect(loggerSpy).toHaveBeenCalledWith('Error ao processar a senha:', customError);
    });
  });

  describe('Edge cases and performance', () => {
    beforeEach(() => {
      mockBcrypt.hash.mockResolvedValue('$2b$10$hashedPassword123' as never);
    });

    it('should handle minimum length password', async () => {
      // Arrange
      const input = { password: 'a' };

      // Act
      const result = await pipe.transform(input);

      // Assert
      expect(mockBcrypt.hash).toHaveBeenCalledWith('a', 10);
      expect(result.password).toBe('$2b$10$hashedPassword123');
    });

    it('should handle object with many properties', async () => {
      // Arrange
      const input = {
        password: 'validPassword123',
        email: 'test@example.com',
        name: 'Test User',
        age: 30,
        isActive: true,
        roles: ['user', 'admin'],
        metadata: { created: new Date() },
      };

      // Act
      const result = await pipe.transform(input);

      // Assert
      expect(result).toEqual({
        ...input,
        password: '$2b$10$hashedPassword123',
      });
    });

    it('should process password efficiently', async () => {
      // Arrange
      const input = { password: 'validPassword123' };
      const startTime = Date.now();

      // Act
      await pipe.transform(input);
      const endTime = Date.now();

      // Assert
      expect(endTime - startTime).toBeLessThan(1000); // Should complete in less than 1 second
    });

    it('should handle concurrent transforms correctly', async () => {
      // Arrange
      const inputs = Array.from({ length: 10 }, (_, i) => ({
        password: `password${i}`,
        userId: i,
      }));

      // Act
      const promises = inputs.map((input) => pipe.transform(input));
      const results = await Promise.all(promises);

      // Assert
      expect(results).toHaveLength(10);
      results.forEach((result, index) => {
        expect(result.password).toBe('$2b$10$hashedPassword123');
        expect(result.userId).toBe(index);
      });
      expect(mockBcrypt.hash).toHaveBeenCalledTimes(10);
    });
  });

  describe('Type safety and validation', () => {
    beforeEach(() => {
      mockBcrypt.hash.mockResolvedValue('$2b$10$hashedPassword123' as never);
    });

    it('should maintain input object structure', async () => {
      // Arrange
      const input = {
        password: 'validPassword123',
        email: 'test@example.com',
        name: 'Test User',
      };

      // Act
      const result = await pipe.transform(input);

      // Assert
      expect(Object.keys(result)).toEqual(['password', 'email', 'name']);
      expect(result.email).toBe('test@example.com');
      expect(result.name).toBe('Test User');
    });

    it('should ensure returned password is always a string', async () => {
      // Arrange
      const input = { password: 'validPassword123' };

      // Act
      const result = await pipe.transform(input);

      // Assert
      expect(typeof result.password).toBe('string');
      expect(result.password).toBeTruthy();
    });
  });
});
