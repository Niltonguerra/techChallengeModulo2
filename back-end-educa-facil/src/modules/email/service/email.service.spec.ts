/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';

interface MockEmailService {
  resend: {
    emails: {
      send: jest.Mock;
    };
  };
}

describe('EmailService', () => {
  let service: EmailService;

  let configService: jest.Mocked<ConfigService>;

  let loggerErrorSpy: jest.SpyInstance;

  beforeEach(async () => {
    // Mock do ConfigService
    const mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'RESEND_API_KEY') return 're_123';

        if (key === 'EMAIL_USER') return 'test@gmail.com';

        return null;
      }),
    };
    // Mock do JwtService
    const mockJwtService = {
      sign: jest.fn(),

      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,

        {
          provide: ConfigService,

          useValue: mockConfigService,
        },

        {
          provide: JwtService,

          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);

    configService = module.get(ConfigService);

    // Mock do logger

    loggerErrorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('enviaVerificacaoEmail', () => {
    const testEmail = 'user@test.com';

    const testUrl = 'user/validationEmail';

    beforeEach(() => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'EMAIL_USER') return 'test@gmail.com';

        if (key === 'EMAIL_PASSWORD') return 'testpassword';

        if (key === 'AMBIENTE') return 'DEV';

        if (key === 'URL_SERVER_DEV') return 'http://localhost:3000/';

        if (key === 'URL_SERVER_PROD') return 'https://meusite.com/';

        if (key === 'RESEND_API_KEY') return 're_123';

        return '';
      });
    });

    it('should send verification email successfully', async () => {
      const sendMock = jest.fn().mockResolvedValue({ id: 'fake-id' });

      (service as unknown as MockEmailService).resend = { emails: { send: sendMock } };

      const result = await service.enviaVerificacaoEmail(testEmail, testUrl);

      expect(sendMock).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'test@gmail.com',
          to: testEmail,
          subject: 'Confirmação de e-mail - EducaFácil',
          html: expect.stringContaining(`http://localhost:3000/${testUrl}?token=${testEmail}`),
        }),
      );

      expect(result).toBe(200);
    });

    it('should return 400 when sendMail throws an error', async () => {
      const sendMock = jest.fn().mockRejectedValue(new Error('SMTP Error'));

      (service as unknown as MockEmailService).resend = { emails: { send: sendMock } };

      const result = await service.enviaVerificacaoEmail(testEmail, testUrl);

      expect(result).toBe(400);

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Erro ao enviar e-mail de verificação:'),
      );
    });

    it('should handle non-Error exceptions', async () => {
      const sendMock = jest.fn().mockRejectedValue('String error'); // não é Error

      (service as unknown as MockEmailService).resend = { emails: { send: sendMock } };

      const result = await service.enviaVerificacaoEmail(testEmail, testUrl);

      expect(result).toBe(400);

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Erro ao enviar e-mail de verificação:'),
      );
    });

    it('should generate correct email content', async () => {
      const sendMock = jest.fn().mockResolvedValue({ id: 'fake-id' });
      (service as unknown as MockEmailService).resend = { emails: { send: sendMock } };

      const result = await service.enviaVerificacaoEmail(testEmail, testUrl);

      expect(sendMock).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'Confirmação de e-mail - EducaFácil',
          html: expect.stringContaining(`http://localhost:3000/${testUrl}?token=${testEmail}`),
          to: testEmail,
        }),
      );

      expect(result).toBe(200);
    });

    it('should use EMAIL_USER from config as sender', async () => {
      const expectedSender = 'configured@email.com';

      configService.get.mockImplementation((key: string) => {
        if (key === 'EMAIL_USER') return expectedSender;

        if (key === 'EMAIL_PASSWORD') return 'testpassword';

        if (key === 'AMBIENTE') return 'DEV';

        if (key === 'URL_SERVER_DEV') return 'http://localhost:3000/';

        if (key === 'URL_SERVER_PROD') return 'https://meusite.com/';

        return '';
      });

      const sendMock = jest.fn().mockResolvedValue({ id: 'fake-id' });

      (service as unknown as MockEmailService).resend = { emails: { send: sendMock } };

      const result = await service.enviaVerificacaoEmail(testEmail, testUrl);

      expect(sendMock).toHaveBeenCalledWith(
        expect.objectContaining({
          from: expectedSender,
        }),
      );

      expect(result).toBe(200);
    });
  });

  describe('sendPasswordResetEmail', () => {
    const testEmail = 'user@test.com';

    const testName = 'User Test';

    const testToken = 'fake-jwt-token';

    const expectedFrontendUrlDev = 'http://localhost:5173';

    const expectedLinkDev = `${expectedFrontendUrlDev}/reset-password?token=${testToken}`;

    beforeEach(() => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'EMAIL_USER') return 'test@gmail.com';

        if (key === 'RESEND_API_KEY') return 're_123';

        if (key === 'AMBIENTE') return 'DEV';

        if (key === 'FRONTEND_URL_LOCAL') return expectedFrontendUrlDev;

        if (key === 'FRONTEND_URL_PROD') return 'https://prod.com';

        return '';
      });
    });

    it('deve montar o link corretamente com URL LOCAL (DEV) e enviar o e-mail', async () => {
      const sendMock = jest.fn().mockResolvedValue({ id: 'fake-id' });

      (service as unknown as MockEmailService).resend = { emails: { send: sendMock } };

      const result = await service.sendPasswordResetEmail(testEmail, testName, testToken);

      expect(sendMock).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'test@gmail.com',

          to: testEmail,

          subject: 'Recuperação de senha - EducaFácil',

          html: expect.stringContaining(expectedLinkDev),
        }),
      );

      expect(result).toBe(200);
    });

    it('deve montar o link corretamente com URL PROD e enviar o e-mail', async () => {
      configService.get.mockImplementation((key: string) => {
        switch (key) {
          case 'AMBIENTE':
            return 'PROD';

          case 'FRONTEND_URL_PROD':
            return 'https://meusite.com';

          case 'EMAIL_USER':
            return 'test@gmail.com';

          default:
            return '';
        }
      });

      const sendMock = jest.fn().mockResolvedValue({ id: 'fake-id' });

      (service as unknown as MockEmailService).resend = { emails: { send: sendMock } };

      const result = await service.sendPasswordResetEmail(testEmail, testName, testToken);

      expect(sendMock).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining('https://meusite.com/reset-password?token='),
        }),
      );

      expect(result).toBe(200);
    });

    it('should return 400 when send fails', async () => {
      const sendMock = jest.fn().mockRejectedValue(new Error('SMTP Error'));

      (service as unknown as MockEmailService).resend = { emails: { send: sendMock } };

      const result = await service.sendPasswordResetEmail(testEmail, testName, testToken);

      expect(result).toBe(400);

      expect(loggerErrorSpy).toHaveBeenCalled();
    });
  });
});
