import { Test, TestingModule } from '@nestjs/testing';
import { SignInUseCase } from './SignIn.usecase';
import { UserService } from '../service/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { UserStatus } from '../entities/enum/status.enum';

describe('SignInUseCase', () => {
  let useCase: SignInUseCase;
  let userService: { findOneUserLogin: jest.Mock };
  let jwtService: { sign: jest.Mock };

  beforeEach(async () => {
    userService = {
      findOneUserLogin: jest.fn(),
    };
    jwtService = {
      sign: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignInUseCase,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();
    useCase = module.get(SignInUseCase);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('deve retornar um token quando credenciais são válidas', async () => {
    const email = 'alice@example.com';
    const password = '123456';
    const permission = 'professor';
    const fakeUser = { email, permission, password: 'hashed-pass' };
    userService.findOneUserLogin.mockResolvedValue(fakeUser);
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
    jwtService.sign.mockReturnValue('signed-jwt-token');
    const result = await useCase.UserAuthentication({ email, password });
    expect(userService.findOneUserLogin).toHaveBeenCalledWith(email);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, fakeUser.password);
    expect(jwtService.sign).toHaveBeenCalledWith({ email, permission });
    expect(result).toEqual({ token: 'signed-jwt-token' });
  });

  it('deve lançar UnauthorizedException quando o usuário não for encontrado', async () => {
    userService.findOneUserLogin.mockResolvedValue(null);
    await expect(
      useCase.UserAuthentication({ email: 'foo@bar.com', password: 'any' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    await expect(
      useCase.UserAuthentication({ email: 'foo@bar.com', password: 'any' }),
    ).rejects.toThrow(systemMessage.ReturnMessage.errorlogin);
  });

  it('deve lançar UnauthorizedException quando a senha estiver incorreta', async () => {
    const fakeUser = {
      email: 'bob@example.com',
      permission: 'aluno',
      password: 'hashed-pass',
    };
    userService.findOneUserLogin.mockResolvedValue(fakeUser);
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);
    await expect(
      useCase.UserAuthentication({ email: fakeUser.email, password: 'wrong' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    await expect(
      useCase.UserAuthentication({ email: fakeUser.email, password: 'wrong' }),
    ).rejects.toThrow(systemMessage.ReturnMessage.errorlogin);
  });

  it('deve lançar UnauthorizedException se o usuário estiver pendente', async () => {
    const email = 'pending@example.com';
    const password = '123456';
    const permission = 'aluno';
    const fakeUser = {
      email,
      permission,
      password: 'hashed-pass',
      isActive: UserStatus.PENDING,
    };
    userService.findOneUserLogin.mockResolvedValue(fakeUser);
    const bcryptSpy = jest.spyOn(bcrypt, 'compare');
    await expect(useCase.UserAuthentication({ email, password })).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(bcryptSpy).not.toHaveBeenCalled();
  });
});
