import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthController } from './SignIn.controller';
import { SignInUseCase } from '../usecases/SignIn.usecase';
import { AuthUserDTO } from '../dtos/AuthUser.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let mockSignInUseCase: {
    UserAuthentication: jest.Mock;
  };

  beforeEach(async () => {
    // Mock do SignInUseCase
    mockSignInUseCase = {
      UserAuthentication: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: SignInUseCase,
          useValue: mockSignInUseCase,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Inicialização', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('POST /user/login - loginUser', () => {
    it('should authenticate user successfully with valid credentials', async () => {
      // Arrange
      const authUserDTO: AuthUserDTO = {
        email: 'test@example.com',
        password: 'validPassword123',
      };

      const expectedResponse = {
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

      mockSignInUseCase.UserAuthentication.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.loginUser(authUserDTO);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockSignInUseCase.UserAuthentication).toHaveBeenCalledWith(authUserDTO);
      expect(mockSignInUseCase.UserAuthentication).toHaveBeenCalledTimes(1);
    });

    it('should handle invalid credentials', async () => {
      // Arrange
      const authUserDTO: AuthUserDTO = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };

      const errorResponse = {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Credenciais inválidas',
      };

      mockSignInUseCase.UserAuthentication.mockResolvedValue(errorResponse);

      // Act
      const result = await controller.loginUser(authUserDTO);

      // Assert
      expect(result).toEqual(errorResponse);
      expect(mockSignInUseCase.UserAuthentication).toHaveBeenCalledWith(authUserDTO);
    });

    it('should handle non-existent user', async () => {
      // Arrange
      const authUserDTO: AuthUserDTO = {
        email: 'nonexistent@example.com',
        password: 'anyPassword123',
      };

      const errorResponse = {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Usuário não encontrado',
      };

      mockSignInUseCase.UserAuthentication.mockResolvedValue(errorResponse);

      // Act
      const result = await controller.loginUser(authUserDTO);

      // Assert
      expect(result).toEqual(errorResponse);
      expect(mockSignInUseCase.UserAuthentication).toHaveBeenCalledWith(authUserDTO);
    });

    it('should handle inactive user account', async () => {
      // Arrange
      const authUserDTO: AuthUserDTO = {
        email: 'inactive@example.com',
        password: 'validPassword123',
      };

      const errorResponse = {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Conta não ativada. Verifique seu e-mail.',
      };

      mockSignInUseCase.UserAuthentication.mockResolvedValue(errorResponse);

      // Act
      const result = await controller.loginUser(authUserDTO);

      // Assert
      expect(result).toEqual(errorResponse);
      expect(mockSignInUseCase.UserAuthentication).toHaveBeenCalledWith(authUserDTO);
    });

    it('should propagate exceptions from use case', async () => {
      // Arrange
      const authUserDTO: AuthUserDTO = {
        email: 'test@example.com',
        password: 'validPassword123',
      };

      const error = new UnauthorizedException('Database connection failed');
      mockSignInUseCase.UserAuthentication.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.loginUser(authUserDTO)).rejects.toThrow(error);
      expect(mockSignInUseCase.UserAuthentication).toHaveBeenCalledWith(authUserDTO);
    });

    it('should handle different email formats', async () => {
      // Arrange
      const authUserDTO: AuthUserDTO = {
        email: 'user+test@example.co.uk',
        password: 'validPassword123',
      };

      const expectedResponse = {
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

      mockSignInUseCase.UserAuthentication.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.loginUser(authUserDTO);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockSignInUseCase.UserAuthentication).toHaveBeenCalledWith(authUserDTO);
    });

    it('should handle admin user login', async () => {
      // Arrange
      const authUserDTO: AuthUserDTO = {
        email: 'admin@example.com',
        password: 'adminPassword123',
      };

      const expectedResponse = {
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

      mockSignInUseCase.UserAuthentication.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.loginUser(authUserDTO);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockSignInUseCase.UserAuthentication).toHaveBeenCalledWith(authUserDTO);
    });

    it('should handle professor user login', async () => {
      // Arrange
      const authUserDTO: AuthUserDTO = {
        email: 'professor@example.com',
        password: 'profPassword123',
      };

      const expectedResponse = {
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

      mockSignInUseCase.UserAuthentication.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.loginUser(authUserDTO);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockSignInUseCase.UserAuthentication).toHaveBeenCalledWith(authUserDTO);
    });
  });

  describe('Error handling scenarios', () => {
    it('should handle server errors gracefully', async () => {
      // Arrange
      const authUserDTO: AuthUserDTO = {
        email: 'test@example.com',
        password: 'validPassword123',
      };

      const errorResponse = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro interno do servidor',
      };

      mockSignInUseCase.UserAuthentication.mockResolvedValue(errorResponse);

      // Act
      const result = await controller.loginUser(authUserDTO);

      // Assert
      expect(result).toEqual(errorResponse);
      expect(mockSignInUseCase.UserAuthentication).toHaveBeenCalledWith(authUserDTO);
    });

    it('should handle malformed email attempts', async () => {
      // Arrange
      const authUserDTO: AuthUserDTO = {
        email: 'malformed-email',
        password: 'validPassword123',
      };

      const errorResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Formato de e-mail inválido',
      };

      mockSignInUseCase.UserAuthentication.mockResolvedValue(errorResponse);

      // Act
      const result = await controller.loginUser(authUserDTO);

      // Assert
      expect(result).toEqual(errorResponse);
      expect(mockSignInUseCase.UserAuthentication).toHaveBeenCalledWith(authUserDTO);
    });
  });
});
