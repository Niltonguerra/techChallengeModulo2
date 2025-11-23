import { Test, TestingModule } from '@nestjs/testing';
import { AuthPasswordService } from './auth-password.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@modules/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/service/email.service';
import { BadRequestException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

const mockEmailService = {
  sendPasswordResetEmail: jest.fn(),
};

const mockUserRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

const mockConfigService = {
  get: jest.fn((key: string) => {
    if (key === 'JWT_SECRET') return 'secret';
    return null;
  }),
};

describe('AuthPasswordService', () => {
  let service: AuthPasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthPasswordService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthPasswordService>(AuthPasswordService);

    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('forgotPassword', () => {
    it('deve gerar token e enviar email se o usuário existir', async () => {
      const user = { email: 'teste@teste.com', name: 'Teste' } as User;
      mockUserRepository.findOne.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue('token123');
      mockEmailService.sendPasswordResetEmail.mockResolvedValue(true);

      const result = await service.forgotPassword({ email: 'teste@teste.com' });

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'teste@teste.com' },
      });
      expect(mockEmailService.sendPasswordResetEmail).toHaveBeenCalledWith(
        user.email,
        user.name,
        'token123',
      );
      expect(result).toEqual({
        message:
          'Se um usuário com este e-mail estiver cadastrado, um link de recuperação será enviado.',
      });
    });

    it('não deve quebrar se o usuário não existir (segurança)', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.forgotPassword({ email: 'naoexiste@teste.com' });

      expect(mockEmailService.sendPasswordResetEmail).not.toHaveBeenCalled();
      expect(result).toEqual({
        message:
          'Se um usuário com este e-mail estiver cadastrado, um link de recuperação será enviado.',
      });
    });
  });

  describe('resetPassword', () => {
    const dto = {
      token: 'validToken',
      newPassword: 'newPass',
      confirmPassword: 'newPass',
    };

    it('deve redefinir a senha com sucesso', async () => {
      const user = { id: '1', email: 'teste@teste.com', password: 'old' } as User;

      mockJwtService.verify.mockReturnValue({ email: 'teste@teste.com' });
      mockUserRepository.findOne.mockResolvedValue(user);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPass');
      mockUserRepository.save.mockResolvedValue({ ...user, password: 'hashedPass' });

      const result = await service.resetPassword(dto);

      expect(bcrypt.hash).toHaveBeenCalledWith('newPass', 10);
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Senha redefinida com sucesso.' });
    });

    it('deve lançar BadRequestException se o token for inválido', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.resetPassword(dto)).rejects.toThrow(BadRequestException);
    });

    it('deve lançar NotFoundException (convertido em BadRequest) se usuário não existir', async () => {
      mockJwtService.verify.mockReturnValue({ email: 'ghost@teste.com' });
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.resetPassword(dto)).rejects.toThrow(BadRequestException);
    });
  });
});
