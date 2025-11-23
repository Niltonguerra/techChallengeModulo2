import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthPasswordService } from './auth-password.service';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthPasswordService;

  const mockService = {
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthPasswordService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthPasswordService>(AuthPasswordService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('forgotPassword', () => {
    it('should call service.forgotPassword', async () => {
      const dto: ForgotPasswordDto = { email: 'test@test.com' };
      const expected = { message: 'ok' };
      mockService.forgotPassword.mockResolvedValue(expected);

      expect(await controller.forgotPassword(dto)).toEqual(expected);
      expect(service.forgotPassword).toHaveBeenCalledWith(dto);
    });
  });

  describe('resetPassword', () => {
    it('should call service.resetPassword', async () => {
      const dto: ResetPasswordDto = {
        token: 'token',
        newPassword: 'pass',
        confirmPassword: 'pass',
      };
      const expected = { message: 'ok' };
      mockService.resetPassword.mockResolvedValue(expected);

      expect(await controller.resetPassword(dto)).toEqual(expected);
      expect(service.resetPassword).toHaveBeenCalledWith(dto);
    });
  });
});
