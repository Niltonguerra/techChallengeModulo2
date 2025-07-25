import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './SignIn.controller';
import { SignInUseCase } from '../usecases/SignIn.usecase';
import {
  authUserDTOMock,
  authUserAdminDTOMock,
  authUserProfessorDTOMock,
  authUserInactiveDTOMock,
  authUserMalformedDTOMock,
  authUserNotFoundDTOMock,
  authUserWrongPasswordDTOMock,
  authUserPlusDTOMock,
  expectedUserResponseMock,
  expectedAdminResponseMock,
  expectedProfessorResponseMock,
  expectedInactiveResponseMock,
  expectedWrongPasswordResponseMock,
  expectedNotFoundResponseMock,
  expectedMalformedResponseMock,
  expectedServerErrorResponseMock,
  expectedPlusResponseMock,
} from './__mocks__/auth.mock';

describe('AuthController', () => {
  let controller: AuthController;
  let signInUseCase: SignInUseCase;

  beforeEach(async () => {
    const mockSignInUseCase = {
      userAuthentication: jest.fn() as (this: void, ...args: any[]) => any,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: SignInUseCase, useValue: mockSignInUseCase }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    signInUseCase = module.get<SignInUseCase>(SignInUseCase);
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  it('deve chamar o usecase com o DTO correto', async () => {
    await controller.loginUser(authUserDTOMock);
    expect(signInUseCase.userAuthentication).toHaveBeenCalledWith(authUserDTOMock);
    // O resultado esperado pode ser mockado conforme necessário
  });

  it('deve propagar erros do usecase', async () => {
    jest.spyOn(signInUseCase, 'userAuthentication').mockRejectedValue(new Error('erro'));
    await expect(controller.loginUser(authUserWrongPasswordDTOMock)).rejects.toThrow('erro');
  });
});

describe('AuthController', () => {
  let controller: AuthController;
  let mockSignInUseCase: {
    userAuthentication: jest.Mock;
  };

  beforeEach(async () => {
    // Mock do SignInUseCase
    mockSignInUseCase = {
      userAuthentication: jest.fn(),
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
      mockSignInUseCase.userAuthentication.mockResolvedValue(expectedUserResponseMock);
      const result = await controller.loginUser(authUserDTOMock);
      expect(result).toEqual(expectedUserResponseMock);
      expect(mockSignInUseCase.userAuthentication).toHaveBeenCalledWith(authUserDTOMock);
      expect(mockSignInUseCase.userAuthentication).toHaveBeenCalledTimes(1);
    });

    it('should handle invalid credentials', async () => {
      // Arrange
      mockSignInUseCase.userAuthentication.mockResolvedValue(expectedWrongPasswordResponseMock);
      const result = await controller.loginUser(authUserWrongPasswordDTOMock);
      expect(result).toEqual(expectedWrongPasswordResponseMock);
      expect(mockSignInUseCase.userAuthentication).toHaveBeenCalledWith(
        authUserWrongPasswordDTOMock,
      );
    });

    it('should handle non-existent user', async () => {
      // Arrange
      mockSignInUseCase.userAuthentication.mockResolvedValue(expectedNotFoundResponseMock);
      const result = await controller.loginUser(authUserNotFoundDTOMock);
      expect(result).toEqual(expectedNotFoundResponseMock);
      expect(mockSignInUseCase.userAuthentication).toHaveBeenCalledWith(authUserNotFoundDTOMock);
    });

    it('should handle inactive user account', async () => {
      // Arrange
      mockSignInUseCase.userAuthentication.mockResolvedValue(expectedInactiveResponseMock);
      const result = await controller.loginUser(authUserInactiveDTOMock);
      expect(result).toEqual(expectedInactiveResponseMock);
      expect(mockSignInUseCase.userAuthentication).toHaveBeenCalledWith(authUserInactiveDTOMock);
    });

    it('should propagate exceptions from use case', async () => {
      // Arrange
      const error = new UnauthorizedException('Database connection failed');
      mockSignInUseCase.userAuthentication.mockRejectedValue(error);
      await expect(controller.loginUser(authUserDTOMock)).rejects.toThrow(error);
      expect(mockSignInUseCase.userAuthentication).toHaveBeenCalledWith(authUserDTOMock);
    });

    it('should handle different email formats', async () => {
      // Arrange
      mockSignInUseCase.userAuthentication.mockResolvedValue(expectedPlusResponseMock);
      const result = await controller.loginUser(authUserPlusDTOMock);
      expect(result).toEqual(expectedPlusResponseMock);
      expect(mockSignInUseCase.userAuthentication).toHaveBeenCalledWith(authUserPlusDTOMock);
    });

    it('should handle admin user login', async () => {
      // Arrange
      mockSignInUseCase.userAuthentication.mockResolvedValue(expectedAdminResponseMock);
      const result = await controller.loginUser(authUserAdminDTOMock);
      expect(result).toEqual(expectedAdminResponseMock);
      expect(mockSignInUseCase.userAuthentication).toHaveBeenCalledWith(authUserAdminDTOMock);
    });

    it('should handle professor user login', async () => {
      // Arrange
      mockSignInUseCase.userAuthentication.mockResolvedValue(expectedProfessorResponseMock);
      const result = await controller.loginUser(authUserProfessorDTOMock);
      expect(result).toEqual(expectedProfessorResponseMock);
      expect(mockSignInUseCase.userAuthentication).toHaveBeenCalledWith(authUserProfessorDTOMock);
    });
  });

  describe('Error handling scenarios', () => {
    it('should handle server errors gracefully', async () => {
      // Arrange
      mockSignInUseCase.userAuthentication.mockResolvedValue(expectedServerErrorResponseMock);
      const result = await controller.loginUser(authUserDTOMock);
      expect(result).toEqual(expectedServerErrorResponseMock);
      expect(mockSignInUseCase.userAuthentication).toHaveBeenCalledWith(authUserDTOMock);
    });

    it('should handle malformed email attempts', async () => {
      // Arrange
      mockSignInUseCase.userAuthentication.mockResolvedValue(expectedMalformedResponseMock);
      const result = await controller.loginUser(authUserMalformedDTOMock);
      expect(result).toEqual(expectedMalformedResponseMock);
      expect(mockSignInUseCase.userAuthentication).toHaveBeenCalledWith(authUserMalformedDTOMock);
    });
  });
});
