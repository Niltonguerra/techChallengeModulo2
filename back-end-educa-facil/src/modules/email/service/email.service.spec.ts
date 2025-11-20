import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { EmailService } from './email.service';

// Mock do nodemailer
jest.mock('nodemailer');
const mockedNodemailer = nodemailer as jest.Mocked<typeof nodemailer>;

describe('EmailService', () => {
  let service: EmailService;
  let configService: jest.Mocked<ConfigService>;
  let loggerErrorSpy: jest.SpyInstance;

  beforeEach(async () => {
    // Mock do ConfigService
    const mockConfigService = {
      get: jest.fn(),
    };

    // Set the mock return values BEFORE module creation
    mockConfigService.get
      .mockReturnValueOnce('test@gmail.com') // EMAIL_USER
      .mockReturnValueOnce('testpassword'); // EMAIL_PASSWORD

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
    loggerErrorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==========================
  // Testes para enviaVerificacaoEmail
  // ==========================
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
        return '';
      });
    });

    it('should send verification email successfully', async () => {
      const sendMock = jest.fn().mockResolvedValue({ id: 'fake-id' });
      service['resend'] = { emails: { send: sendMock } } as unknown as Resend;

      const result = await service.enviaVerificacaoEmail(testEmail, testUrl);

      expect(sendMock).toHaveBeenCalledWith({
        from: 'test@gmail.com',
        to: testEmail,
        subject: 'Verificação de e-mail do aplicativo MoveSmart',
        html: `Clique no link a seguir para verificar seu e-mail: http://localhost:3000/${testUrl}?token=${testEmail}`,
      });

      expect(result).toBe(200);
    });

    it('should return 400 when sendMail throws an error', async () => {
      const sendMock = jest.fn().mockRejectedValue(new Error('SMTP Error'));
      service['resend'] = { emails: { send: sendMock } } as unknown as Resend;

      const result = await service.enviaVerificacaoEmail(testEmail, testUrl);

      expect(result).toBe(400);
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        `Erro ao enviar e-mail de verificação: SMTP Error`,
      );
    });

    it('should handle non-Error exceptions', async () => {
      const sendMock = jest.fn().mockRejectedValue('String error'); // não é Error
      service['resend'] = { emails: { send: sendMock } } as unknown as Resend;

      const result = await service.enviaVerificacaoEmail(testEmail, testUrl);

      expect(result).toBe(400);
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Erro ao enviar e-mail de verificação:'),
      );
    });

    it('should generate correct email content', async () => {
      const expectedSubject = 'Verificação de e-mail do aplicativo MoveSmart';
      const expectedHtml = `Clique no link a seguir para verificar seu e-mail: http://localhost:3000/${testUrl}?token=${testEmail}`;

      const sendMock = jest.fn().mockResolvedValue({ id: 'fake-id' });
      service['resend'] = { emails: { send: sendMock } } as unknown as Resend;

      const result = await service.enviaVerificacaoEmail(testEmail, testUrl);

      expect(sendMock).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: expectedSubject,
          html: expectedHtml,
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
      service['resend'] = { emails: { send: sendMock } } as unknown as Resend;

      const result = await service.enviaVerificacaoEmail(testEmail, testUrl);

      expect(sendMock).toHaveBeenCalledWith(
        expect.objectContaining({
          from: expectedSender,
        }),
      );

      expect(result).toBe(200);
    });
  });

  // ==========================
  // Testes para sendPasswordResetEmail
  // ==========================
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
      (service as any).resend = { emails: { send: sendMock } } as unknown as Resend;

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
        if (key === 'AMBIENTE') return 'PROD';
        if (key === 'FRONTEND_URL_PROD') return 'https://meusite.com';
        if (key === 'EMAIL_USER') return 'test@gmail.com';
        return '';
      });

      const sendMock = jest.fn().mockResolvedValue({ id: 'fake-id' });
      (service as any).resend = { emails: { send: sendMock } } as unknown as Resend;

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
      (service as any).resend = { emails: { send: sendMock } } as unknown as Resend;

      const result = await service.sendPasswordResetEmail(testEmail, testName, testToken);

      expect(result).toBe(400);
      expect(loggerErrorSpy).toHaveBeenCalled();
    });
  });
});
