import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuardUser } from '@modules/auth/guards/jwt-auth-user.guard';
import { RolesGuardStudent } from '@modules/auth/guards/roles-student.guard';
import { UserWriteController } from './UserWrite.controller';
import { CreateUserUseCase } from '../usecases/createUser.usecase';
import { UserDeleteService } from '../service/userDelete.service';
import { UserService } from '../service/user.service';
import {
  mockCreateUserDTO,
  mockReturnMessageDTO,
  mockReturnMessageDTOValid,
  mockToken,
  mockUpdateUserDTO,
} from './__mocks__/user.controller.mock';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';

describe('UserWriteController', () => {
  let controller: UserWriteController;
  let createUserUseCase: CreateUserUseCase;
  let userDeleteService: UserDeleteService;
  let userService: UserService;

  const mockUserDeleteService = {
    deleteUser: jest.fn(),
  };

  const mockUserService = {
    createUpdateUser: jest.fn(),
  };

  const mockCreateUserUseCase = {
    validationEmailCreateUser: jest.fn(),
    create: jest.fn(),
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
      .compile();

    controller = module.get<UserWriteController>(UserWriteController);
    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    userDeleteService = module.get<UserDeleteService>(UserDeleteService);
    userService = module.get<UserService>(UserService);
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
      mockCreateUserUseCase.validationEmailCreateUser.mockRejectedValue(new Error('erro'));
      await expect(controller.createUser(mockCreateUserDTO)).rejects.toThrow('erro');
    });
  });

  describe('validationEmail', () => {
    it('should validate email successfully', async () => {
      mockCreateUserUseCase.create.mockResolvedValue(mockReturnMessageDTOValid);
      const result = await controller.validationEmail(mockToken);
      expect(result).toBe(mockReturnMessageDTOValid);
      expect(createUserUseCase.create).toHaveBeenCalledWith(mockToken);
    });

    it('should propagate error when validating email', async () => {
      mockCreateUserUseCase.create.mockRejectedValue(new Error('erro'));
      await expect(controller.validationEmail(mockToken)).rejects.toThrow('erro');
    });
  });

  describe('editUser', () => {
    it('should edit a user successfully', async () => {
      mockUserService.createUpdateUser.mockResolvedValue(mockReturnMessageDTO);
      const result = await controller.EditUser(mockUpdateUserDTO);
      expect(result).toBe(mockReturnMessageDTO);
      expect(userService.createUpdateUser).toHaveBeenCalledWith(mockUpdateUserDTO);
    });

    it('should handle error when editing user', async () => {
      mockUserService.createUpdateUser.mockRejectedValue(new Error('erro'));
      const result: ReturnMessageDTO = await controller.EditUser(mockUpdateUserDTO);
      expect(result.statusCode).toBe(500);
      expect(result.message).toBe('Erro ao deletar o usuário');
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      mockUserDeleteService.deleteUser.mockResolvedValue(mockReturnMessageDTO);
      const result = await controller.deleteUser('test-id');
      expect(result).toBe(mockReturnMessageDTO);
      expect(userDeleteService.deleteUser).toHaveBeenCalledWith('test-id');
    });

    it('should handle error when deleting user', async () => {
      mockUserDeleteService.deleteUser.mockRejectedValue(new Error('erro'));
      const result: ReturnMessageDTO = await controller.deleteUser('test-id');
      expect(result.statusCode).toBe(500);
      expect(result.message).toBe('Erro ao deletar o usuário');
    });
  });
});
