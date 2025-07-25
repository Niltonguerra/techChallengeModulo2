import { Test, TestingModule } from '@nestjs/testing';
import { SignInUseCase } from './SignIn.usecase';
import { UserService } from '@modules/user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from '@nestjs/common';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { UserStatusEnum } from '../enum/status.enum';
import * as bcrypt from 'bcrypt';

describe('SignInUseCase', () => {
  let useCase: SignInUseCase;
  let mockUserService: { findOneUserLogin: jest.Mock };
  let mockJwtService: { sign: jest.Mock };

  beforeEach(async () => {
    mockUserService = { findOneUserLogin: jest.fn() };
    mockJwtService = { sign: jest.fn() };
    jest.spyOn(bcrypt, 'compare').mockClear();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignInUseCase,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();
    useCase = module.get<SignInUseCase>(SignInUseCase);
  });

  it('deve autenticar e retornar token para usuário válido', async () => {
    const authUserDTO = { email: 'user@email.com', password: '123' };
    const userMock = {
      id: '1',
      email: authUserDTO.email,
      password: 'hashed',
      permission: 'admin',
      isActive: 'ACTIVE',
    };
    mockUserService.findOneUserLogin.mockResolvedValue(userMock);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    mockJwtService.sign.mockReturnValue('token123');
    const result = await useCase.userAuthentication(authUserDTO);
    expect(result).toEqual({ token: 'token123' });
  });

  it('deve lançar HttpException se usuário não encontrado', async () => {
    const authUserDTO = { email: 'fail@email.com', password: '123' };
    mockUserService.findOneUserLogin.mockResolvedValue(false);
    await expect(useCase.userAuthentication(authUserDTO)).rejects.toThrow(HttpException);
  });

  it('deve lançar HttpException se usuário pendente', async () => {
    const authUserDTO = { email: 'pending@email.com', password: '123' };
    const userMock = {
      id: '2',
      email: authUserDTO.email,
      password: 'hashed',
      permission: 'user',
      isActive: UserStatusEnum.PENDING,
    };
    mockUserService.findOneUserLogin.mockResolvedValue(userMock);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    await expect(useCase.userAuthentication(authUserDTO)).rejects.toThrow(HttpException);
  });

  it('deve lançar HttpException se senha incorreta', async () => {
    const authUserDTO = { email: 'user@email.com', password: 'wrong' };
    const userMock = {
      id: '1',
      email: authUserDTO.email,
      password: 'hashed',
      permission: 'admin',
      isActive: 'ACTIVE',
    };
    mockUserService.findOneUserLogin.mockResolvedValue(userMock);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    await expect(useCase.userAuthentication(authUserDTO)).rejects.toThrow(HttpException);
  });

  it('deve lançar HttpException para erro inesperado', async () => {
    const authUserDTO = { email: 'user@email.com', password: '123' };
    mockUserService.findOneUserLogin.mockRejectedValue(new Error('Falha inesperada'));
    await expect(useCase.userAuthentication(authUserDTO)).rejects.toThrow(HttpException);
    await expect(useCase.userAuthentication(authUserDTO)).rejects.toThrow(
      `${systemMessage.ReturnMessage.errorlogin}: 500`,
    );
  });
});
