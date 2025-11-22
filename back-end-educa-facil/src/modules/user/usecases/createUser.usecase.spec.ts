import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserUseCase } from './createUser.usecase';
import { UserService } from '../service/user.service';
import { EmailService } from '@modules/email/service/email.service';
import {
  mockCreateUserDTO,
  notFoundResponse,
  successValidationEmailResponse,
  existingUserResponse,
  foundUserResponse,
  responseWithoutUser,
  successResponse,
} from './__mocks__/create-user-usecase.mock';
import { UserStatusEnum } from '../enum/status.enum';
import { systemMessage } from '@config/i18n/pt/systemMessage';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockUserService: {
    findOneUser: jest.Mock;
    createUpdateUser: jest.Mock;
  };
  let mockEmailService: {
    enviaVerificacaoEmail: jest.Mock;
  };

  beforeEach(async () => {
    mockUserService = {
      findOneUser: jest.fn(),
      createUpdateUser: jest.fn(),
    };
    mockEmailService = {
      enviaVerificacaoEmail: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        { provide: UserService, useValue: mockUserService },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();
    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
  });

  it('deve criar usuário e enviar email com sucesso', async () => {
    mockUserService.findOneUser.mockResolvedValue(notFoundResponse);
    mockEmailService.enviaVerificacaoEmail.mockReturnValue(200);
    mockUserService.createUpdateUser.mockResolvedValue(successResponse);
    const result = await useCase.validationEmailCreateUser(mockCreateUserDTO);
    expect(result).toEqual(successValidationEmailResponse);
    expect(mockUserService.findOneUser).toHaveBeenCalledWith('email', mockCreateUserDTO.email);
    expect(mockEmailService.enviaVerificacaoEmail).toHaveBeenCalledWith(
      mockCreateUserDTO.email,
      'user/validationEmail',
    );
    expect(mockUserService.createUpdateUser).toHaveBeenCalledWith({
      ...mockCreateUserDTO,
      is_active: UserStatusEnum.PENDING,
    });
  });

  it('deve lançar erro se usuário já existe', async () => {
    mockUserService.findOneUser.mockResolvedValue(existingUserResponse);
    await expect(useCase.validationEmailCreateUser(mockCreateUserDTO)).rejects.toThrow(
      HttpException,
    );
  });

  it('deve lançar erro se emailService retorna erro', async () => {
    mockUserService.findOneUser.mockResolvedValue(notFoundResponse);
    mockEmailService.enviaVerificacaoEmail.mockReturnValue(500);
    await expect(useCase.validationEmailCreateUser(mockCreateUserDTO)).rejects.toThrow(
      HttpException,
    );
  });

  it('deve lançar erro se usuário não encontrado ao ativar', async () => {
    mockUserService.findOneUser.mockResolvedValue(notFoundResponse);
    await expect(useCase.updateStatus('token')).rejects.toThrow(HttpException);
  });

  it('deve ativar usuário e retornar sucesso', async () => {
    mockUserService.findOneUser.mockResolvedValue(foundUserResponse);
    mockUserService.createUpdateUser.mockResolvedValue(successResponse);
    const result = await useCase.updateStatus('token');
    expect(result).toEqual({
      statusCode: HttpStatus.CREATED,
      message: systemMessage.ReturnMessage.sucessCreateUser,
    });
    expect(mockUserService.findOneUser).toHaveBeenCalledWith('email', 'token');
    expect(mockUserService.createUpdateUser).toHaveBeenCalledWith({
      id: foundUserResponse.user?.id,
      is_active: UserStatusEnum.ACTIVE,
    });
  });

  it('deve lançar erro se resposta não tem user', async () => {
    mockUserService.findOneUser.mockResolvedValue(responseWithoutUser);
    await expect(useCase.updateStatus('token')).rejects.toThrow(HttpException);
  });
});
