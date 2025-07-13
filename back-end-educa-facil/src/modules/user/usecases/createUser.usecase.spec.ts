import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserUseCase } from './createUser.usecase';
import { UserService } from '../service/user.service';
import { EmailService } from '@modules/email/email.service';
import { CreateUserDTO } from '../dtos/createUser.dto';
import { UserStatus } from '../entities/enum/status.enum';
import { UserPermission } from '../entities/enum/permission.enum';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { FindOneUserReturnMessageDTO } from '../dtos/returnMessageCRUD.dto';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockUserService: {
    findOneUser: jest.Mock;
    createUpdateUser: jest.Mock;
  };
  let mockEmailService: {
    EnviaVerificacaoEmail: jest.Mock;
  };
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(async () => {
    // Mock do UserService
    mockUserService = {
      findOneUser: jest.fn(),
      createUpdateUser: jest.fn(),
    };

    // Mock do EmailService
    mockEmailService = {
      EnviaVerificacaoEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);

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

  describe('validationEmailCreateUser', () => {
    const mockCreateUserDTO: CreateUserDTO = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      photo: 'https://example.com/photo.jpg',
      social_midia: { twitter: '@testuser' },
      permission: UserPermission.USER,
      notification: true,
    };

    it('should create user and send validation email successfully', async () => {
      // Arrange
      const notFoundResponse: ReturnMessageDTO = {
        statusCode: 400,
        message: systemMessage.ReturnMessage.errorUserNotFound,
      };

      const successResponse: ReturnMessageDTO = {
        statusCode: 200,
        message: systemMessage.ReturnMessage.sucessCreateUser,
      };

      mockUserService.findOneUser.mockResolvedValue(notFoundResponse);
      mockEmailService.EnviaVerificacaoEmail.mockReturnValue(200);
      mockUserService.createUpdateUser.mockResolvedValue(successResponse);

      // Act
      const result = await useCase.validationEmailCreateUser(mockCreateUserDTO);

      // Assert
      expect(result).toEqual({
        statusCode: HttpStatus.CREATED,
        message: systemMessage.ReturnMessage.sucessCreateUserValidationEmail,
      });

      expect(mockUserService.findOneUser).toHaveBeenCalledWith('email', mockCreateUserDTO.email);
      expect(mockEmailService.EnviaVerificacaoEmail).toHaveBeenCalledWith(
        mockCreateUserDTO.email,
        'user/validationEmail',
      );
      expect(mockUserService.createUpdateUser).toHaveBeenCalledWith({
        ...mockCreateUserDTO,
        isActive: UserStatus.PENDING,
      });
    });

    it('should throw error when email already exists', async () => {
      // Arrange
      const existingUserResponse: FindOneUserReturnMessageDTO = {
        statusCode: 200,
        message: systemMessage.ReturnMessage.sucessGetPostById,
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Existing User',
          email: 'test@example.com',
          photo: 'https://example.com/photo.jpg',
          social_midia: { twitter: '@existing' },
          notification: true,
        },
      };

      mockUserService.findOneUser.mockResolvedValue(existingUserResponse);

      // Act & Assert
      try {
        await useCase.validationEmailCreateUser(mockCreateUserDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect((error as HttpException).getStatus()).toBe(HttpStatus.CONFLICT);
        expect((error as HttpException).message).toBe(
          'Erro ao criar o usuário: Erro ao criar o usuário',
        );
      }
    });

    it('should throw HttpException with BAD_GATEWAY status when email service fails', async () => {
      // Arrange
      const notFoundResponse: ReturnMessageDTO = {
        statusCode: 400,
        message: systemMessage.ReturnMessage.errorUserNotFound,
      };

      mockUserService.findOneUser.mockResolvedValue(notFoundResponse);
      mockEmailService.EnviaVerificacaoEmail.mockReturnValue(500); // Email service failure

      // Act & Assert
      try {
        await useCase.validationEmailCreateUser(mockCreateUserDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect((error as HttpException).getStatus()).toBe(HttpStatus.BAD_GATEWAY);
        expect((error as HttpException).message).toBe(
          'Erro ao criar o usuário: Erro ao enviar o e-mail',
        );
      }
    });

    it('should handle different non-success email service status codes', async () => {
      // Arrange
      const notFoundResponse: ReturnMessageDTO = {
        statusCode: 400,
        message: systemMessage.ReturnMessage.errorUserNotFound,
      };

      mockUserService.findOneUser.mockResolvedValue(notFoundResponse);
      mockEmailService.EnviaVerificacaoEmail.mockReturnValue(404);

      // Act & Assert
      await expect(useCase.validationEmailCreateUser(mockCreateUserDTO)).rejects.toThrow(
        HttpException,
      );
      await expect(useCase.validationEmailCreateUser(mockCreateUserDTO)).rejects.toThrow(
        'Erro ao criar o usuário: Erro ao enviar o e-mail',
      );
    });

    it('should handle user service findOneUser errors', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      mockUserService.findOneUser.mockRejectedValue(dbError);

      // Act & Assert
      await expect(useCase.validationEmailCreateUser(mockCreateUserDTO)).rejects.toThrow(
        HttpException,
      );
      await expect(useCase.validationEmailCreateUser(mockCreateUserDTO)).rejects.toThrow(
        'Erro ao criar o usuário: Erro ao criar o usuário',
      );

      expect(mockUserService.findOneUser).toHaveBeenCalledWith('email', mockCreateUserDTO.email);
      expect(mockEmailService.EnviaVerificacaoEmail).not.toHaveBeenCalled();
      expect(mockUserService.createUpdateUser).not.toHaveBeenCalled();
    });

    it('should handle user service createUpdateUser errors', async () => {
      // Arrange
      const notFoundResponse: ReturnMessageDTO = {
        statusCode: 400,
        message: systemMessage.ReturnMessage.errorUserNotFound,
      };

      const dbError = new Error('Failed to save user');
      mockUserService.findOneUser.mockResolvedValue(notFoundResponse);
      mockEmailService.EnviaVerificacaoEmail.mockReturnValue(200);
      mockUserService.createUpdateUser.mockRejectedValue(dbError);

      // Act & Assert
      await expect(useCase.validationEmailCreateUser(mockCreateUserDTO)).rejects.toThrow(
        HttpException,
      );
      await expect(useCase.validationEmailCreateUser(mockCreateUserDTO)).rejects.toThrow(
        'Erro ao criar o usuário: Erro ao criar o usuário',
      );

      expect(mockUserService.findOneUser).toHaveBeenCalledWith('email', mockCreateUserDTO.email);
      expect(mockEmailService.EnviaVerificacaoEmail).toHaveBeenCalledWith(
        mockCreateUserDTO.email,
        'user/validationEmail',
      );
      expect(mockUserService.createUpdateUser).toHaveBeenCalledWith({
        ...mockCreateUserDTO,
        isActive: UserStatus.PENDING,
      });
    });

    it('should handle non-Error exceptions', async () => {
      // Arrange
      mockUserService.findOneUser.mockRejectedValue('String error');

      // Act & Assert
      await expect(useCase.validationEmailCreateUser(mockCreateUserDTO)).rejects.toThrow(
        HttpException,
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith('String error');
    });
  });

  describe('create', () => {
    const testToken = 'test@example.com';

    it('should activate user successfully', async () => {
      // Arrange
      const foundUserResponse: FindOneUserReturnMessageDTO = {
        statusCode: 200,
        message: systemMessage.ReturnMessage.sucessGetPostById,
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Test User',
          email: 'test@example.com',
          photo: 'https://example.com/photo.jpg',
          social_midia: { twitter: '@testuser' },
          notification: true,
        },
      };

      const updateResponse: ReturnMessageDTO = {
        statusCode: 200,
        message: systemMessage.ReturnMessage.sucessCreateUser,
      };

      mockUserService.findOneUser.mockResolvedValue(foundUserResponse);
      mockUserService.createUpdateUser.mockResolvedValue(updateResponse);

      // Act
      const result = await useCase.create(testToken);

      // Assert
      expect(result).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'Usuário criado com sucesso!',
      });

      expect(mockUserService.findOneUser).toHaveBeenCalledWith('email', testToken);
      expect(mockUserService.createUpdateUser).toHaveBeenCalledWith({
        id: foundUserResponse.user.id,
        isActive: UserStatus.ACTIVE,
      });
    });

    it('should throw error when email not found', async () => {
      // Arrange
      const notFoundResponse: ReturnMessageDTO = {
        statusCode: 400,
        message: systemMessage.ReturnMessage.errorUserNotFound,
      };

      mockUserService.findOneUser.mockResolvedValue(notFoundResponse);

      // Act & Assert
      await expect(useCase.create(testToken)).rejects.toThrow(HttpException);
      await expect(useCase.create(testToken)).rejects.toThrow(
        'Erro ao criar o usuário: Usuário não encontrado',
      );

      expect(mockUserService.findOneUser).toHaveBeenCalledWith('email', testToken);
      expect(mockUserService.createUpdateUser).not.toHaveBeenCalled();
    });

    it('should throw HttpException with NOT_FOUND status when user not found in create', async () => {
      // Arrange
      const notFoundResponse: ReturnMessageDTO = {
        statusCode: 400,
        message: systemMessage.ReturnMessage.errorUserNotFound,
      };

      mockUserService.findOneUser.mockResolvedValue(notFoundResponse);

      // Act & Assert
      try {
        await useCase.create(testToken);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
        expect((error as HttpException).message).toBe(
          'Erro ao criar o usuário: Usuário não encontrado',
        );
      }
    });

    it('should return correct success message from systemMessage', async () => {
      // Arrange
      const foundUserResponse: FindOneUserReturnMessageDTO = {
        statusCode: 200,
        message: systemMessage.ReturnMessage.sucessGetPostById,
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Test User',
          email: 'test@example.com',
          photo: 'https://example.com/photo.jpg',
          social_midia: { twitter: '@testuser' },
          notification: true,
        },
      };

      const updateResponse: ReturnMessageDTO = {
        statusCode: 200,
        message: systemMessage.ReturnMessage.sucessCreateUser,
      };

      mockUserService.findOneUser.mockResolvedValue(foundUserResponse);
      mockUserService.createUpdateUser.mockResolvedValue(updateResponse);

      // Act
      const result = await useCase.create(testToken);

      // Assert
      expect(result).toEqual({
        statusCode: HttpStatus.CREATED,
        message: systemMessage.ReturnMessage.sucessCreateUser,
      });
    });

    it('should handle user service findOneUser errors in create', async () => {
      // Arrange
      const dbError = new Error('Database query failed');
      mockUserService.findOneUser.mockRejectedValue(dbError);

      // Act & Assert
      await expect(useCase.create(testToken)).rejects.toThrow(HttpException);
      await expect(useCase.create(testToken)).rejects.toThrow(
        'Erro ao criar o usuário: Erro ao criar o usuário',
      );

      expect(mockUserService.findOneUser).toHaveBeenCalledWith('email', testToken);
      expect(mockUserService.createUpdateUser).not.toHaveBeenCalled();
    });

    it('should handle user service createUpdateUser errors in create', async () => {
      // Arrange
      const foundUserResponse: FindOneUserReturnMessageDTO = {
        statusCode: 200,
        message: systemMessage.ReturnMessage.sucessGetPostById,
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Test User',
          email: 'test@example.com',
          photo: 'https://example.com/photo.jpg',
          social_midia: { twitter: '@testuser' },
          notification: true,
        },
      };

      const updateError = new Error('Failed to update user status');
      mockUserService.findOneUser.mockResolvedValue(foundUserResponse);
      mockUserService.createUpdateUser.mockRejectedValue(updateError);

      // Act & Assert
      await expect(useCase.create(testToken)).rejects.toThrow(HttpException);
      await expect(useCase.create(testToken)).rejects.toThrow(
        'Erro ao criar o usuário: Erro ao criar o usuário',
      );

      expect(mockUserService.findOneUser).toHaveBeenCalledWith('email', testToken);
      expect(mockUserService.createUpdateUser).toHaveBeenCalledWith({
        id: foundUserResponse.user.id,
        isActive: UserStatus.ACTIVE,
      });
    });

    it('should handle response without user property', async () => {
      // Arrange
      const responseWithoutUser: ReturnMessageDTO = {
        statusCode: 200,
        message: 'Some message',
      };

      mockUserService.findOneUser.mockResolvedValue(responseWithoutUser);

      // Act & Assert
      await expect(useCase.create(testToken)).rejects.toThrow(HttpException);
      await expect(useCase.create(testToken)).rejects.toThrow(
        'Erro ao criar o usuário: Usuário não encontrado',
      );

      expect(mockUserService.findOneUser).toHaveBeenCalledWith('email', testToken);
      expect(mockUserService.createUpdateUser).not.toHaveBeenCalled();
    });

    it('should handle non-Error exceptions in create', async () => {
      // Arrange
      mockUserService.findOneUser.mockRejectedValue('String error in create');

      // Act & Assert
      await expect(useCase.create(testToken)).rejects.toThrow(HttpException);

      expect(consoleErrorSpy).toHaveBeenCalledWith('String error in create');
    });
  });

  describe('Integration scenarios', () => {
    it('should handle special email formats', async () => {
      // Arrange
      const specialEmailDTO: CreateUserDTO = {
        ...{
          name: 'Test User',
          email: 'user+test@example.co.uk',
          password: 'password123',
          photo: 'https://example.com/photo.jpg',
          social_midia: { twitter: '@testuser' },
          permission: UserPermission.USER,
          notification: true,
        },
      };

      const notFoundResponse: ReturnMessageDTO = {
        statusCode: 400,
        message: systemMessage.ReturnMessage.errorUserNotFound,
      };

      const successResponse: ReturnMessageDTO = {
        statusCode: 200,
        message: systemMessage.ReturnMessage.sucessCreateUser,
      };

      mockUserService.findOneUser.mockResolvedValue(notFoundResponse);
      mockEmailService.EnviaVerificacaoEmail.mockReturnValue(200);
      mockUserService.createUpdateUser.mockResolvedValue(successResponse);

      // Act
      const result = await useCase.validationEmailCreateUser(specialEmailDTO);

      // Assert
      expect(result).toEqual({
        statusCode: HttpStatus.CREATED,
        message: systemMessage.ReturnMessage.sucessCreateUserValidationEmail,
      });

      expect(mockUserService.findOneUser).toHaveBeenCalledWith('email', specialEmailDTO.email);
    });

    it('should handle empty social_midia object', async () => {
      // Arrange
      const userWithEmptySocial: CreateUserDTO = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        photo: 'https://example.com/photo.jpg',
        social_midia: {},
        permission: UserPermission.USER,
        notification: false,
      };

      const notFoundResponse: ReturnMessageDTO = {
        statusCode: 400,
        message: systemMessage.ReturnMessage.errorUserNotFound,
      };

      const successResponse: ReturnMessageDTO = {
        statusCode: 200,
        message: systemMessage.ReturnMessage.sucessCreateUser,
      };

      mockUserService.findOneUser.mockResolvedValue(notFoundResponse);
      mockEmailService.EnviaVerificacaoEmail.mockReturnValue(200);
      mockUserService.createUpdateUser.mockResolvedValue(successResponse);

      // Act
      const result = await useCase.validationEmailCreateUser(userWithEmptySocial);

      // Assert
      expect(result).toEqual({
        statusCode: HttpStatus.CREATED,
        message: systemMessage.ReturnMessage.sucessCreateUserValidationEmail,
      });

      expect(mockUserService.createUpdateUser).toHaveBeenCalledWith({
        ...userWithEmptySocial,
        isActive: UserStatus.PENDING,
      });
    });
  });
});
