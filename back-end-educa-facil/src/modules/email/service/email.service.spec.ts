import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { EmailService } from './email.service';
import * as nodemailer from 'nodemailer';

// Mock do nodemailer
jest.mock('nodemailer');
const mockedNodemailer = nodemailer as jest.Mocked<typeof nodemailer>;

describe('EmailService', () => {
  let service: EmailService;
  let configService: jest.Mocked<ConfigService>;
  let mockTransporter: { sendMail: jest.Mock };
  let loggerErrorSpy: jest.SpyInstance;

  beforeEach(async () => {
    // Mock do transporter
    mockTransporter = {
      sendMail: jest.fn(),
    };

    // Mock do nodemailer.createTransport
    (mockedNodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

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

  describe('Inicialização do serviço', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should create transporter with correct configuration', () => {
      expect(mockedNodemailer.createTransport).toHaveBeenCalledWith({
        service: 'gmail',
        auth: {
          user: 'test@gmail.com',
          pass: 'testpassword',
        },
      });
    });
  });

  describe('enviaVerificacaoEmail', () => {
    const testEmail = 'user@test.com';
    const testUrl = 'user/validationEmail';

    beforeEach(() => {
      // Mock do ConfigService.get para simular ambiente DEV e URL_SERVER_DEV
      configService.get.mockImplementation((key: string) => {
        if (key === 'EMAIL_USER') return 'test@gmail.com';
        if (key === 'EMAIL_PASSWORD') return 'testpassword';
        if (key === 'AMBIENTE') return 'DEV';
        if (key === 'URL_SERVER_DEV') return 'http://localhost:3000/';
        if (key === 'URL_SERVER_PROD') return 'https://meusite.com/';
        return '';
      });
    });

    it('should send verification email successfully', () => {
      // Arrange
      mockTransporter.sendMail.mockImplementation(() => {});

      // Act
      const result = service.enviaVerificacaoEmail(testEmail, testUrl);

      // Assert
      expect(result).toBe(200);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: 'test@gmail.com',
        to: testEmail,
        subject: 'Verificação de e-mail do aplicativo MoveSmart',
        text: `Clique no link a seguir para verificar seu e-mail: http://localhost:3000/${testUrl}?token=${testEmail}`,
      });
    });

    it('should return 400 when sendMail throws an error', () => {
      // Arrange
      const error = new Error('SMTP Error');
      mockTransporter.sendMail.mockImplementation(() => {
        throw error;
      });

      // Act
      const result = service.enviaVerificacaoEmail(testEmail, testUrl);

      // Assert
      expect(result).toBe(400);
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        `Erro ao enviar e-mail de verificação: ${error.message}`,
      );
    });

    it('should handle non-Error exceptions', () => {
      // Arrange
      mockTransporter.sendMail.mockImplementation(() => {
        throw new Error('String error');
      });

      // Act
      const result = service.enviaVerificacaoEmail(testEmail, testUrl);

      // Assert
      expect(result).toBe(400);
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Erro ao enviar e-mail de verificação:'),
      );
    });

    it('should generate correct email content', () => {
      // Arrange
      const expectedSubject = 'Verificação de e-mail do aplicativo MoveSmart';
      const expectedText = `Clique no link a seguir para verificar seu e-mail: http://localhost:3000/${testUrl}?token=${testEmail}`;

      // Act
      service.enviaVerificacaoEmail(testEmail, testUrl);

      // Assert
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: expectedSubject,
          text: expectedText,
          to: testEmail,
        }),
      );
    });

    it('should use EMAIL_USER from config as sender', () => {
      // Arrange
      const expectedSender = 'configured@email.com';
      configService.get.mockImplementation((key: string) => {
        if (key === 'EMAIL_USER') return expectedSender;
        if (key === 'EMAIL_PASSWORD') return 'testpassword';
        if (key === 'AMBIENTE') return 'DEV';
        if (key === 'URL_SERVER_DEV') return 'http://localhost:3000/';
        if (key === 'URL_SERVER_PROD') return 'https://meusite.com/';
        return '';
      });

      // Act
      service.enviaVerificacaoEmail(testEmail, testUrl);

      // Assert
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: expectedSender,
        }),
      );
    });
  });
});
