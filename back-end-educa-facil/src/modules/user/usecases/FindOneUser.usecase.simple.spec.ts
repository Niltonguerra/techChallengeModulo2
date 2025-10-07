import { systemMessage } from '@config/i18n/pt/systemMessage';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { searchByFieldUserEnum } from '../enum/searchByFieldUser.enum';
import { UserService } from '../service/user.service';
import { FindOneUserUseCase } from './FindOneUser.usecase';

describe('FindOneUserUseCase (simple)', () => {
  let useCase: FindOneUserUseCase;
  let mockUserService: { findOneUser: jest.Mock };

  beforeEach(async () => {
    mockUserService = { findOneUser: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindOneUserUseCase, { provide: UserService, useValue: mockUserService }],
    }).compile();
    useCase = module.get<FindOneUserUseCase>(FindOneUserUseCase);
  });

  it('deve retornar usuário encontrado', async () => {
    const params = { field: searchByFieldUserEnum.EMAIL, value: 'user@email.com' };
    const userMock = { statusCode: 200, message: 'ok', user: { id: '1', name: 'User' } };
    mockUserService.findOneUser.mockResolvedValue(userMock);
    const result = await useCase.findOneUserUseCase(params);
    expect(result).toEqual(userMock);
    expect(mockUserService.findOneUser).toHaveBeenCalledWith(params.field, params.value);
  });

  it('deve retornar erro padrão se lançar HttpException', async () => {
    const params = { field: searchByFieldUserEnum.EMAIL, value: 'fail@email.com' };
    const error = new HttpException('Erro customizado', HttpStatus.BAD_REQUEST);
    mockUserService.findOneUser.mockRejectedValue(error);
    await expect(useCase.findOneUserUseCase(params)).rejects.toThrow(HttpException);
    await expect(useCase.findOneUserUseCase(params)).rejects.toThrow('Erro customizado: 400');
  });

  it('deve retornar erro padrão se lançar erro comum', async () => {
    const params = { field: searchByFieldUserEnum.EMAIL, value: 'fail@email.com' };
    const error = new Error('Falha interna');
    mockUserService.findOneUser.mockRejectedValue(error);
    await expect(useCase.findOneUserUseCase(params)).rejects.toThrow(HttpException);
    await expect(useCase.findOneUserUseCase(params)).rejects.toThrow(
      `${systemMessage.ReturnMessage.errorUserNotFound}: 500`,
    );
  });

  it('deve retornar erro padrão se lançar string', async () => {
    const params = { field: searchByFieldUserEnum.EMAIL, value: 'fail@email.com' };
    mockUserService.findOneUser.mockRejectedValue('erro string');
    await expect(useCase.findOneUserUseCase(params)).rejects.toThrow(HttpException);
    await expect(useCase.findOneUserUseCase(params)).rejects.toThrow(
      `${systemMessage.ReturnMessage.errorUserNotFound}: 500`,
    );
  });
});
