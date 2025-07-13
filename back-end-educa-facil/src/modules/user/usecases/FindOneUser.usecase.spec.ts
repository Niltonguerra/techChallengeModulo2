import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FindOneUserUseCase } from './FindOneUser.usecase';
import { UserService } from '../service/user.service';
import { FindOneUserReturnMessageDTO } from '../dtos/returnMessageCRUD.dto';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { systemMessage } from '@config/i18n/pt/systemMessage';

describe('FindOneUserUseCase', () => {
  let useCase: FindOneUserUseCase;
  let mockUserService: {
    findOneUser: jest.Mock;
  };
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(async () => {
    // Mock do UserService
    mockUserService = {
      findOneUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindOneUserUseCase,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    useCase = module.get<FindOneUserUseCase>(FindOneUserUseCase);

    // Mock console.error para evitar logs durante os testes
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  describe('Inicialização', () => {
    it('should be defined', () => {
      expect(useCase).toBeDefined();
    });
  });

  describe('findOneUserUseCase', () => {
    const testField = 'email';
    const testValue = 'test@example.com';

    it('should find user successfully', async () => {
      // Arrange
      const successResponse: FindOneUserReturnMessageDTO = {
        statusCode: 200,
        message: systemMessage.ReturnMessage.sucessGetPostById,
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Test User',
          photo: 'https://example.com/photo.jpg',
          email: 'test@example.com',
          social_midia: { twitter: '@testuser' },
          notification: true,
        },
      };

      mockUserService.findOneUser.mockResolvedValue(successResponse);

      // Act
      const result = await useCase.findOneUserUseCase(testField, testValue);

      // Assert
      expect(result).toEqual(successResponse);
      expect(mockUserService.findOneUser).toHaveBeenCalledWith(testField, testValue);
      expect(mockUserService.findOneUser).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should return error when user not found', async () => {
      // Arrange
      const notFoundResponse: ReturnMessageDTO = {
        statusCode: 400,
        message: systemMessage.ReturnMessage.errorUserNotFound,
      };

      mockUserService.findOneUser.mockResolvedValue(notFoundResponse);

      // Act
      const result = await useCase.findOneUserUseCase(testField, testValue);

      // Assert
      expect(result).toEqual(notFoundResponse);
      expect(mockUserService.findOneUser).toHaveBeenCalledWith(testField, testValue);
      expect(mockUserService.findOneUser).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should find user by id successfully', async () => {
      // Arrange
      const field = 'id';
      const value = '123e4567-e89b-12d3-a456-426614174000';

      const successResponse: FindOneUserReturnMessageDTO = {
        statusCode: 200,
        message: systemMessage.ReturnMessage.sucessGetPostById,
        user: {
          id: value,
          name: 'Test User',
          photo: 'https://example.com/photo.jpg',
          email: 'test@example.com',
          social_midia: { twitter: '@testuser' },
          notification: true,
        },
      };

      mockUserService.findOneUser.mockResolvedValue(successResponse);

      // Act
      const result = await useCase.findOneUserUseCase(field, value);

      // Assert
      expect(result).toEqual(successResponse);
      expect(mockUserService.findOneUser).toHaveBeenCalledWith(field, value);
    });

    it('should find user by name successfully', async () => {
      // Arrange
      const field = 'name';
      const value = 'Test User';

      const successResponse: FindOneUserReturnMessageDTO = {
        statusCode: 200,
        message: systemMessage.ReturnMessage.sucessGetPostById,
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: value,
          photo: 'https://example.com/photo.jpg',
          email: 'test@example.com',
          social_midia: { twitter: '@testuser' },
          notification: true,
        },
      };

      mockUserService.findOneUser.mockResolvedValue(successResponse);

      // Act
      const result = await useCase.findOneUserUseCase(field, value);

      // Assert
      expect(result).toEqual(successResponse);
      expect(mockUserService.findOneUser).toHaveBeenCalledWith(field, value);
    });

    it('should handle database connection errors', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      mockUserService.findOneUser.mockRejectedValue(dbError);

      // Act & Assert
      await expect(useCase.findOneUserUseCase(testField, testValue)).rejects.toThrow(HttpException);
      await expect(useCase.findOneUserUseCase(testField, testValue)).rejects.toThrow(
        'Erro ao encontrar o usuário: Database connection failed',
      );

      expect(mockUserService.findOneUser).toHaveBeenCalledWith(testField, testValue);
      expect(consoleErrorSpy).toHaveBeenCalledWith(dbError);
    });

    it('should handle database query timeout errors', async () => {
      // Arrange
      const timeoutError = new Error('Query timeout');
      mockUserService.findOneUser.mockRejectedValue(timeoutError);

      // Act & Assert
      await expect(useCase.findOneUserUseCase(testField, testValue)).rejects.toThrow(HttpException);
      await expect(useCase.findOneUserUseCase(testField, testValue)).rejects.toThrow(
        'Erro ao encontrar o usuário: Query timeout',
      );

      expect(mockUserService.findOneUser).toHaveBeenCalledWith(testField, testValue);
      expect(consoleErrorSpy).toHaveBeenCalledWith(timeoutError);
    });

    it('should handle non-Error exceptions', async () => {
      // Arrange
      const stringError = 'String error occurred';
      mockUserService.findOneUser.mockRejectedValue(stringError);

      // Act & Assert
      await expect(useCase.findOneUserUseCase(testField, testValue)).rejects.toThrow(HttpException);
      await expect(useCase.findOneUserUseCase(testField, testValue)).rejects.toThrow(
        `Erro ao encontrar o usuário: ${systemMessage.ReturnMessage.errorUserNotFound}`,
      );

      expect(mockUserService.findOneUser).toHaveBeenCalledWith(testField, testValue);
      expect(consoleErrorSpy).toHaveBeenCalledWith(stringError);
    });

    it('should handle null exceptions', async () => {
      // Arrange
      mockUserService.findOneUser.mockRejectedValue(null);

      // Act & Assert
      await expect(useCase.findOneUserUseCase(testField, testValue)).rejects.toThrow(HttpException);
      await expect(useCase.findOneUserUseCase(testField, testValue)).rejects.toThrow(
        `Erro ao encontrar o usuário: ${systemMessage.ReturnMessage.errorUserNotFound}`,
      );

      expect(mockUserService.findOneUser).toHaveBeenCalledWith(testField, testValue);
      expect(consoleErrorSpy).toHaveBeenCalledWith(null);
    });

    it('should handle undefined exceptions', async () => {
      // Arrange
      mockUserService.findOneUser.mockRejectedValue(undefined);

      // Act & Assert
      await expect(useCase.findOneUserUseCase(testField, testValue)).rejects.toThrow(HttpException);
      await expect(useCase.findOneUserUseCase(testField, testValue)).rejects.toThrow(
        `Erro ao encontrar o usuário: ${systemMessage.ReturnMessage.errorUserNotFound}`,
      );

      expect(mockUserService.findOneUser).toHaveBeenCalledWith(testField, testValue);
      expect(consoleErrorSpy).toHaveBeenCalledWith(undefined);
    });

    it('should throw HttpException with INTERNAL_SERVER_ERROR status', async () => {
      // Arrange
      const error = new Error('Test error');
      mockUserService.findOneUser.mockRejectedValue(error);

      // Act & Assert
      try {
        await useCase.findOneUserUseCase(testField, testValue);
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(HttpException);
        expect((thrownError as HttpException).getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect((thrownError as HttpException).message).toBe(
          'Erro ao encontrar o usuário: Test error',
        );
      }
    });
  });

  describe('Edge cases and special scenarios', () => {
    it('should handle empty string field', async () => {
      // Arrange
      const field = '';
      const value = 'test@example.com';

      const notFoundResponse: ReturnMessageDTO = {
        statusCode: 400,
        message: systemMessage.ReturnMessage.errorUserNotFound,
      };

      mockUserService.findOneUser.mockResolvedValue(notFoundResponse);

      // Act
      const result = await useCase.findOneUserUseCase(field, value);

      // Assert
      expect(result).toEqual(notFoundResponse);
      expect(mockUserService.findOneUser).toHaveBeenCalledWith(field, value);
    });

    it('should handle empty string value', async () => {
      // Arrange
      const field = 'email';
      const value = '';

      const notFoundResponse: ReturnMessageDTO = {
        statusCode: 400,
        message: systemMessage.ReturnMessage.errorUserNotFound,
      };

      mockUserService.findOneUser.mockResolvedValue(notFoundResponse);

      // Act
      const result = await useCase.findOneUserUseCase(field, value);

      // Assert
      expect(result).toEqual(notFoundResponse);
      expect(mockUserService.findOneUser).toHaveBeenCalledWith(field, value);
    });

    it('should handle special characters in email', async () => {
      // Arrange
      const field = 'email';
      const value = 'user+test@example.co.uk';

      const successResponse: FindOneUserReturnMessageDTO = {
        statusCode: 200,
        message: systemMessage.ReturnMessage.sucessGetPostById,
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Test User',
          photo: 'https://example.com/photo.jpg',
          email: value,
          social_midia: { twitter: '@testuser' },
          notification: true,
        },
      };

      mockUserService.findOneUser.mockResolvedValue(successResponse);

      // Act
      const result = await useCase.findOneUserUseCase(field, value);

      // Assert
      expect(result).toEqual(successResponse);
      expect(mockUserService.findOneUser).toHaveBeenCalledWith(field, value);
    });

    it('should handle user with empty social_midia', async () => {
      // Arrange
      const field = 'email';
      const value = 'test@example.com';

      const successResponse: FindOneUserReturnMessageDTO = {
        statusCode: 200,
        message: systemMessage.ReturnMessage.sucessGetPostById,
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Test User',
          photo: 'https://example.com/photo.jpg',
          email: value,
          social_midia: {},
          notification: false,
        },
      };

      mockUserService.findOneUser.mockResolvedValue(successResponse);

      // Act
      const result = await useCase.findOneUserUseCase(field, value);

      // Assert
      expect(result).toEqual(successResponse);
      expect(mockUserService.findOneUser).toHaveBeenCalledWith(field, value);
    });

    it('should handle case-sensitive field names', async () => {
      // Arrange
      const field = 'EMAIL'; // Uppercase field
      const value = 'test@example.com';

      const notFoundResponse: ReturnMessageDTO = {
        statusCode: 400,
        message: systemMessage.ReturnMessage.errorUserNotFound,
      };

      mockUserService.findOneUser.mockResolvedValue(notFoundResponse);

      // Act
      const result = await useCase.findOneUserUseCase(field, value);

      // Assert
      expect(result).toEqual(notFoundResponse);
      expect(mockUserService.findOneUser).toHaveBeenCalledWith(field, value);
    });

    it('should handle long text values', async () => {
      // Arrange
      const field = 'name';
      const value = 'A'.repeat(1000); // Very long name

      const notFoundResponse: ReturnMessageDTO = {
        statusCode: 400,
        message: systemMessage.ReturnMessage.errorUserNotFound,
      };

      mockUserService.findOneUser.mockResolvedValue(notFoundResponse);

      // Act
      const result = await useCase.findOneUserUseCase(field, value);

      // Assert
      expect(result).toEqual(notFoundResponse);
      expect(mockUserService.findOneUser).toHaveBeenCalledWith(field, value);
    });

    it('should handle SQL injection attempts gracefully', async () => {
      // Arrange
      const field = 'email';
      const value = "'; DROP TABLE users; --";

      const notFoundResponse: ReturnMessageDTO = {
        statusCode: 400,
        message: systemMessage.ReturnMessage.errorUserNotFound,
      };

      mockUserService.findOneUser.mockResolvedValue(notFoundResponse);

      // Act
      const result = await useCase.findOneUserUseCase(field, value);

      // Assert
      expect(result).toEqual(notFoundResponse);
      expect(mockUserService.findOneUser).toHaveBeenCalledWith(field, value);
    });
  });

  describe('Performance and reliability', () => {
    it('should handle multiple concurrent calls', async () => {
      // Arrange
      const field = 'email';
      const values = ['user1@test.com', 'user2@test.com', 'user3@test.com'];

      const responses = values.map((email, index) => ({
        statusCode: 200,
        message: systemMessage.ReturnMessage.sucessGetPostById,
        user: {
          id: `123e4567-e89b-12d3-a456-42661417400${index}`,
          name: `User ${index + 1}`,
          photo: 'https://example.com/photo.jpg',
          email,
          social_midia: { twitter: `@user${index + 1}` },
          notification: true,
        },
      }));

      mockUserService.findOneUser
        .mockResolvedValueOnce(responses[0])
        .mockResolvedValueOnce(responses[1])
        .mockResolvedValueOnce(responses[2]);

      // Act
      const promises = values.map((value) => useCase.findOneUserUseCase(field, value));
      const results = await Promise.all(promises);

      // Assert
      expect(results).toEqual(responses);
      expect(mockUserService.findOneUser).toHaveBeenCalledTimes(3);
    });

    it('should handle service calls that take different amounts of time', async () => {
      // Arrange
      const field = 'email';
      const value = 'slow@example.com';

      const successResponse: FindOneUserReturnMessageDTO = {
        statusCode: 200,
        message: systemMessage.ReturnMessage.sucessGetPostById,
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Slow User',
          photo: 'https://example.com/photo.jpg',
          email: value,
          social_midia: { twitter: '@slowuser' },
          notification: true,
        },
      };

      // Simulate slow response
      mockUserService.findOneUser.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(successResponse), 100);
          }),
      );

      // Act
      const start = Date.now();
      const result = await useCase.findOneUserUseCase(field, value);
      const duration = Date.now() - start;

      // Assert
      expect(result).toEqual(successResponse);
      expect(duration).toBeGreaterThanOrEqual(100);
      expect(mockUserService.findOneUser).toHaveBeenCalledWith(field, value);
    });
  });
});
