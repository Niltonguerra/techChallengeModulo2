import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuardUser } from '@modules/auth/guards/jwt-auth-user.guard';
import { RolesGuardStudent } from '@modules/auth/guards/roles-student.guard';
import { UserWriteController } from './UserWrite.controller';
import { CreateUserUseCase } from '../usecases/createUser.usecase';
import { UserDeleteService } from '../service/userDelete.service';
import { UserService } from '../service/user.service';
import { RolesGuardProfessor } from '@modules/auth/guards/roles-professor.guard';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDTO } from '../dtos/createUser.dto';
import { UpdateUserDTO } from '../dtos/updateUser.dto';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { route_account_confirmation } from '@modules/email/templates/route_account_confirmation';

jest.mock('@modules/email/templates/account_confirmation', () => ({
  account_confirmation: '<html>Success</html>',
}));
jest.mock('@modules/email/templates/error_confirmation_route_account', () => ({
  error_confirmation_route_account: (msg: string) => `<html>Error: ${msg}</html>`,
}));

const mockReturnMessageDTO: ReturnMessageDTO = { message: 'Success', statusCode: 200 };
const mockCreateUserDTO = { email: 'test@test.com' } as CreateUserDTO;
const mockUpdateUserDTO = { name: 'Updated Name' } as UpdateUserDTO;
const mockToken = 'valid-token';

describe('UserWriteController', () => {
  let controller: UserWriteController;
  let createUserUseCase: CreateUserUseCase;
  let userDeleteService: UserDeleteService;
  let userService: UserService;
  let loggerErrorSpy: jest.SpyInstance;

  const mockUserDeleteService = {
    deleteUser: jest.fn(),
  };

  const mockUserService = {
    createUpdateUser: jest.fn(),
  };

  const mockCreateUserUseCase = {
    validationEmailCreateUser: jest.fn(),
    updateStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserWriteController],
      providers: [
        {
          provide: CreateUserUseCase,
          useValue: mockCreateUserUseCase,
        },
        {
          provide: UserDeleteService,
          useValue: mockUserDeleteService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuardUser)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuardStudent)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuardProfessor)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UserWriteController>(UserWriteController);
    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    userDeleteService = module.get<UserDeleteService>(UserDeleteService);
    userService = module.get<UserService>(UserService);

    loggerErrorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      mockCreateUserUseCase.validationEmailCreateUser.mockResolvedValue(mockReturnMessageDTO);

      const result = await controller.createUser(mockCreateUserDTO);

      expect(result).toBe(mockReturnMessageDTO);
      expect(createUserUseCase.validationEmailCreateUser).toHaveBeenCalledWith(mockCreateUserDTO);
    });

    it('should propagate error when creating user', async () => {
      const error = new Error('erro');
      mockCreateUserUseCase.validationEmailCreateUser.mockRejectedValue(error);

      await expect(controller.createUser(mockCreateUserDTO)).rejects.toThrow('erro');
    });
  });

  describe('validationEmail', () => {
    const mockResponse = () => {
      const res: Partial<Response> = {};
      res.status = jest.fn().mockReturnValue(res);
      res.send = jest.fn().mockReturnValue(res);
      return res as Response;
    };

    it('should validate email successfully (Status 201 -> 200 OK)', async () => {
      const res = mockResponse();
      mockCreateUserUseCase.updateStatus.mockResolvedValue({
        statusCode: 201,
        message: 'Validado',
      });

      await controller.validationEmail(mockToken, res);

      expect(createUserUseCase.updateStatus).toHaveBeenCalledWith(mockToken);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(expect.stringContaining(route_account_confirmation));
    });

    it('should handle validation failure (Status != 201 -> 404 Not Found)', async () => {
      const res = mockResponse();
      mockCreateUserUseCase.updateStatus.mockResolvedValue({
        statusCode: 400,
        message: 'Token inválido',
      });

      await controller.validationEmail(mockToken, res);

      expect(createUserUseCase.updateStatus).toHaveBeenCalledWith(mockToken);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith(expect.stringContaining('Error'));
    });
  });

  describe('editUser', () => {
    const userId = '1';

    it('should edit a user successfully with merged ID', async () => {
      mockUserService.createUpdateUser.mockResolvedValue(mockReturnMessageDTO);

      const result = await controller.EditUser(userId, mockUpdateUserDTO);

      expect(result).toBe(mockReturnMessageDTO);
      expect(userService.createUpdateUser).toHaveBeenCalledWith({
        id: userId,
        ...mockUpdateUserDTO,
      });
    });

    it('should log error and throw InternalServerErrorException', async () => {
      mockUserService.createUpdateUser.mockRejectedValue(new Error('erro BD'));

      await expect(controller.EditUser(userId, mockUpdateUserDTO)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(loggerErrorSpy).toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    const userId = 'test-id';

    it('should delete a user successfully', async () => {
      mockUserDeleteService.deleteUser.mockResolvedValue(mockReturnMessageDTO);

      const result = await controller.deleteUser(userId);

      expect(result).toBe(mockReturnMessageDTO);
      expect(userDeleteService.deleteUser).toHaveBeenCalledWith(userId);
    });

    it('should log error and throw InternalServerErrorException', async () => {
      mockUserDeleteService.deleteUser.mockRejectedValue(new Error('erro BD'));

      await expect(controller.deleteUser(userId)).rejects.toThrow(InternalServerErrorException);

      expect(loggerErrorSpy).toHaveBeenCalled();
    });
  });
});
