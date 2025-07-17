import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { UserController } from './user.controller';
import { CreateUserUseCase } from '../usecases/createUser.usecase';
import { FindOneUserUseCase } from '../usecases/FindOneUser.usecase';
import { CreateUserDTO } from '../dtos/createUser.dto';
import { FindOneUserQueryParamsDTO } from '../dtos/findOneQueryParams.dto';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { FindOneUserReturnMessageDTO } from '../dtos/returnMessageCRUD.dto';
import { UserPermissionEnum } from '../enum/permission.enum';
import { JwtAuthGuardUser } from '@modules/auth/guards/jwt-auth-user.guard';
import { RolesGuardProfessor } from '@modules/auth/guards/roles-professor.guard';
import { HashPasswordPipe } from '@modules/auth/pipe/passwordEncryption.pipe';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('UserController', () => {
  let controller: UserController;
  let mockCreateUserUseCase: {
    validationEmailCreateUser: jest.Mock;
    create: jest.Mock;
  };
  let mockFindOneUserUseCase: {
    findOneUserUseCase: jest.Mock;
  };

  beforeEach(async () => {
    // Mock do CreateUserUseCase
    mockCreateUserUseCase = {
      validationEmailCreateUser: jest.fn(),
      create: jest.fn(),
    };

    // Mock do FindOneUserUseCase
    mockFindOneUserUseCase = {
      findOneUserUseCase: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: CreateUserUseCase, useValue: mockCreateUserUseCase },
        { provide: FindOneUserUseCase, useValue: mockFindOneUserUseCase },
        { provide: JwtAuthGuardUser, useValue: { canActivate: jest.fn().mockReturnValue(true) } },
        {
          provide: RolesGuardProfessor,
          useValue: { canActivate: jest.fn().mockReturnValue(true) },
        },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        { provide: HashPasswordPipe, useValue: { transform: jest.fn((v) => v) } },
        { provide: ConfigService, useValue: {} },
        { provide: Reflector, useValue: {} },
        { provide: JwtService, useValue: {} },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Inicialização', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('POST /user/create - CreateUser', () => {
    it('should create user successfully', async () => {
      // Arrange
      const createUserDTO: CreateUserDTO = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword123',
        photo: 'https://example.com/photo.jpg',
        social_midia: { twitter: '@testuser' },
        permission: UserPermissionEnum.USER,
        notification: true,
      };

      const expectedResponse: ReturnMessageDTO = {
        statusCode: HttpStatus.CREATED,
        message: 'E-mail de verificação enviado com sucesso',
      };

      mockCreateUserUseCase.validationEmailCreateUser.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.CreateUser(createUserDTO);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockCreateUserUseCase.validationEmailCreateUser).toHaveBeenCalledWith(createUserDTO);
      expect(mockCreateUserUseCase.validationEmailCreateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when creating user', async () => {
      // Arrange
      const createUserDTO: CreateUserDTO = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword123',
        photo: 'https://example.com/photo.jpg',
        social_midia: { twitter: '@testuser' },
        permission: UserPermissionEnum.USER,
        notification: true,
      };

      const errorResponse: ReturnMessageDTO = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Email já cadastrado',
      };

      mockCreateUserUseCase.validationEmailCreateUser.mockResolvedValue(errorResponse);

      // Act
      const result = await controller.CreateUser(createUserDTO);

      // Assert
      expect(result).toEqual(errorResponse);
      expect(mockCreateUserUseCase.validationEmailCreateUser).toHaveBeenCalledWith(createUserDTO);
    });

    it('should propagate exceptions from use case', async () => {
      // Arrange
      const createUserDTO: CreateUserDTO = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword123',
        photo: 'https://example.com/photo.jpg',
        social_midia: { twitter: '@testuser' },
        permission: UserPermissionEnum.USER,
        notification: true,
      };

      const error = new Error('Database connection failed');
      mockCreateUserUseCase.validationEmailCreateUser.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.CreateUser(createUserDTO)).rejects.toThrow(error);
    });
  });

  describe('GET /user/validationEmail - validationEmail', () => {
    it('should validate email token successfully', async () => {
      // Arrange
      const token = 'test@example.com';
      const expectedResponse: ReturnMessageDTO = {
        statusCode: HttpStatus.CREATED,
        message: 'Usuário criado com sucesso!',
      };

      mockCreateUserUseCase.create.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.validationEmail(token);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockCreateUserUseCase.create).toHaveBeenCalledWith(token);
      expect(mockCreateUserUseCase.create).toHaveBeenCalledTimes(1);
    });

    it('should handle invalid token', async () => {
      // Arrange
      const token = 'invalid@token.com';
      const errorResponse: ReturnMessageDTO = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Email não encontrado',
      };

      mockCreateUserUseCase.create.mockResolvedValue(errorResponse);

      // Act
      const result = await controller.validationEmail(token);

      // Assert
      expect(result).toEqual(errorResponse);
      expect(mockCreateUserUseCase.create).toHaveBeenCalledWith(token);
    });

    it('should propagate exceptions from create use case', async () => {
      // Arrange
      const token = 'test@example.com';
      const error = new Error('Token validation failed');
      mockCreateUserUseCase.create.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.validationEmail(token)).rejects.toThrow(error);
    });
  });

  describe('GET /user/findOne - FindOne', () => {
    it('should find user successfully', async () => {
      // Arrange
      const queryParams: FindOneUserQueryParamsDTO = {
        field: 'email',
        value: 'test@example.com',
      };

      const expectedResponse: FindOneUserReturnMessageDTO = {
        statusCode: HttpStatus.OK,
        message: 'Usuário encontrado com sucesso',
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Test User',
          photo: 'https://example.com/photo.jpg',
          email: 'test@example.com',
          social_midia: { twitter: '@testuser' },
          notification: true,
        },
      };

      mockFindOneUserUseCase.findOneUserUseCase.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.FindOne(queryParams);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockFindOneUserUseCase.findOneUserUseCase).toHaveBeenCalledWith(
        queryParams.field,
        queryParams.value,
      );
      expect(mockFindOneUserUseCase.findOneUserUseCase).toHaveBeenCalledTimes(1);
    });

    it('should handle user not found', async () => {
      // Arrange
      const queryParams: FindOneUserQueryParamsDTO = {
        field: 'email',
        value: 'notfound@example.com',
      };

      const errorResponse: ReturnMessageDTO = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Usuário não encontrado',
      };

      mockFindOneUserUseCase.findOneUserUseCase.mockResolvedValue(errorResponse);

      // Act
      const result = await controller.FindOne(queryParams);

      // Assert
      expect(result).toEqual(errorResponse);
      expect(mockFindOneUserUseCase.findOneUserUseCase).toHaveBeenCalledWith(
        queryParams.field,
        queryParams.value,
      );
    });

    it('should find user by different field (id)', async () => {
      // Arrange
      const queryParams: FindOneUserQueryParamsDTO = {
        field: 'id',
        value: '123e4567-e89b-12d3-a456-426614174000',
      };

      const expectedResponse: FindOneUserReturnMessageDTO = {
        statusCode: HttpStatus.OK,
        message: 'Usuário encontrado com sucesso',
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Test User',
          photo: 'https://example.com/photo.jpg',
          email: 'test@example.com',
          social_midia: { twitter: '@testuser' },
          notification: true,
        },
      };

      mockFindOneUserUseCase.findOneUserUseCase.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.FindOne(queryParams);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockFindOneUserUseCase.findOneUserUseCase).toHaveBeenCalledWith(
        'id',
        queryParams.value,
      );
    });

    it('should propagate exceptions from find use case', async () => {
      // Arrange
      const queryParams: FindOneUserQueryParamsDTO = {
        field: 'email',
        value: 'test@example.com',
      };

      const error = new Error('Database query failed');
      mockFindOneUserUseCase.findOneUserUseCase.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.FindOne(queryParams)).rejects.toThrow(error);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle empty query parameters gracefully', async () => {
      // Arrange
      const queryParams: FindOneUserQueryParamsDTO = {
        field: '',
        value: '',
      };

      const errorResponse: ReturnMessageDTO = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Parâmetros inválidos',
      };

      mockFindOneUserUseCase.findOneUserUseCase.mockResolvedValue(errorResponse);

      // Act
      const result = await controller.FindOne(queryParams);

      // Assert
      expect(result).toEqual(errorResponse);
      expect(mockFindOneUserUseCase.findOneUserUseCase).toHaveBeenCalledWith('', '');
    });

    it('should handle special characters in token', async () => {
      // Arrange
      const token = 'user+test@example.com';
      const expectedResponse: ReturnMessageDTO = {
        statusCode: HttpStatus.CREATED,
        message: 'Usuário criado com sucesso!',
      };

      mockCreateUserUseCase.create.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.validationEmail(token);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockCreateUserUseCase.create).toHaveBeenCalledWith(token);
    });
  });
});
