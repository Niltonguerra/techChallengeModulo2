import { Test, TestingModule } from '@nestjs/testing';
import { AuthPasswordController } from './auth-password.controller';
import { AuthPasswordService } from './auth-password.service';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

describe('AuthPasswordController', () => {
  let controller: AuthPasswordController;
  let service: AuthPasswordService;

  const mockService = {
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthPasswordController],
      providers: [
        {
          provide: AuthPasswordService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AuthPasswordController>(AuthPasswordController);
    service = module.get<AuthPasswordService>(AuthPasswordService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('forgotPassword', () => {
    it('should call service.forgotPassword with correct params', async () => {
      const dto: ForgotPasswordDto = { email: 'test@test.com' };
      const expectedResult = { message: 'Email sent' };

      mockService.forgotPassword.mockResolvedValue(expectedResult);

      const result = await controller.forgotPassword(dto);

      expect(result).toEqual(expectedResult);
      expect(service.forgotPassword).toHaveBeenCalledWith(dto);
    });
  });

  describe('resetPassword', () => {
    it('should call service.resetPassword with correct params', async () => {
      const dto: ResetPasswordDto = {
        token: 'abc',
        newPassword: '123',
        confirmPassword: '123',
      };
      const expectedResult = { message: 'Success' };

      mockService.resetPassword.mockResolvedValue(expectedResult);

      const result = await controller.resetPassword(dto);

      expect(result).toEqual(expectedResult);
      expect(service.resetPassword).toHaveBeenCalledWith(dto);
    });
  });
});
