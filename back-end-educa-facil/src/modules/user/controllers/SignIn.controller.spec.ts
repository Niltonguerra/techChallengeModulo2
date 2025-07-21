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
} from '../__mocks__/auth.mock';

describe('AuthController', () => {
  let controller: AuthController;
  let signInUseCase: SignInUseCase;

  beforeEach(async () => {
    const mockSignInUseCase = {
      UserAuthentication: jest.fn() as (this: void, ...args: any[]) => any,
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
    expect(signInUseCase.UserAuthentication).toHaveBeenCalledWith(authUserDTOMock);
    // O resultado esperado pode ser mockado conforme necessário
  });

  it('deve propagar erros do usecase', async () => {
    jest.spyOn(signInUseCase, 'UserAuthentication').mockRejectedValue(new Error('erro'));
    await expect(controller.loginUser(authUserWrongPasswordDTOMock)).rejects.toThrow('erro');
  });
});

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
      mockSignInUseCase.UserAuthentication.mockResolvedValue(expectedUserResponseMock);
      const result = await controller.loginUser(authUserDTOMock);
      expect(result).toEqual(expectedUserResponseMock);
      expect(mockSignInUseCase.UserAuthentication).toHaveBeenCalledWith(authUserDTOMock);
      expect(mockSignInUseCase.UserAuthentication).toHaveBeenCalledTimes(1);
    });

    it('should handle invalid credentials', async () => {
      // Arrange
      mockSignInUseCase.UserAuthentication.mockResolvedValue(expectedWrongPasswordResponseMock);
      const result = await controller.loginUser(authUserWrongPasswordDTOMock);
      expect(result).toEqual(expectedWrongPasswordResponseMock);
      expect(mockSignInUseCase.UserAuthentication).toHaveBeenCalledWith(
        authUserWrongPasswordDTOMock,
      );
    });

    it('should handle non-existent user', async () => {
      // Arrange
      mockSignInUseCase.UserAuthentication.mockResolvedValue(expectedNotFoundResponseMock);
      const result = await controller.loginUser(authUserNotFoundDTOMock);
      expect(result).toEqual(expectedNotFoundResponseMock);
      expect(mockSignInUseCase.UserAuthentication).toHaveBeenCalledWith(authUserNotFoundDTOMock);
    });

    it('should handle inactive user account', async () => {
      // Arrange
      mockSignInUseCase.UserAuthentication.mockResolvedValue(expectedInactiveResponseMock);
      const result = await controller.loginUser(authUserInactiveDTOMock);
      expect(result).toEqual(expectedInactiveResponseMock);
      expect(mockSignInUseCase.UserAuthentication).toHaveBeenCalledWith(authUserInactiveDTOMock);
    });

    it('should propagate exceptions from use case', async () => {
      // Arrange
      const error = new UnauthorizedException('Database connection failed');
      mockSignInUseCase.UserAuthentication.mockRejectedValue(error);
      await expect(controller.loginUser(authUserDTOMock)).rejects.toThrow(error);
      expect(mockSignInUseCase.UserAuthentication).toHaveBeenCalledWith(authUserDTOMock);
    });

    it('should handle different email formats', async () => {
      // Arrange
      mockSignInUseCase.UserAuthentication.mockResolvedValue(expectedPlusResponseMock);
      const result = await controller.loginUser(authUserPlusDTOMock);
      expect(result).toEqual(expectedPlusResponseMock);
      expect(mockSignInUseCase.UserAuthentication).toHaveBeenCalledWith(authUserPlusDTOMock);
    });

    it('should handle admin user login', async () => {
      // Arrange
      mockSignInUseCase.UserAuthentication.mockResolvedValue(expectedAdminResponseMock);
      const result = await controller.loginUser(authUserAdminDTOMock);
      expect(result).toEqual(expectedAdminResponseMock);
      expect(mockSignInUseCase.UserAuthentication).toHaveBeenCalledWith(authUserAdminDTOMock);
    });

    it('should handle professor user login', async () => {
      // Arrange
      mockSignInUseCase.UserAuthentication.mockResolvedValue(expectedProfessorResponseMock);
      const result = await controller.loginUser(authUserProfessorDTOMock);
      expect(result).toEqual(expectedProfessorResponseMock);
      expect(mockSignInUseCase.UserAuthentication).toHaveBeenCalledWith(authUserProfessorDTOMock);
    });
  });

  describe('Error handling scenarios', () => {
    it('should handle server errors gracefully', async () => {
      // Arrange
      mockSignInUseCase.UserAuthentication.mockResolvedValue(expectedServerErrorResponseMock);
      const result = await controller.loginUser(authUserDTOMock);
      expect(result).toEqual(expectedServerErrorResponseMock);
      expect(mockSignInUseCase.UserAuthentication).toHaveBeenCalledWith(authUserDTOMock);
    });

    it('should handle malformed email attempts', async () => {
      // Arrange
      mockSignInUseCase.UserAuthentication.mockResolvedValue(expectedMalformedResponseMock);
      const result = await controller.loginUser(authUserMalformedDTOMock);
      expect(result).toEqual(expectedMalformedResponseMock);
      expect(mockSignInUseCase.UserAuthentication).toHaveBeenCalledWith(authUserMalformedDTOMock);
    });
  });
});
