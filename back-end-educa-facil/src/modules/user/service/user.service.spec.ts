import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { IUser } from '../entities/interfaces/user.interface';
import { systemMessage } from '@config/i18n/pt/systemMessage';

jest.mock('uuid', () => ({ v4: () => 'mocked-uuid-123' }));

describe('UserService', () => {
  let service: UserService;
  let mockRepository: { save: jest.Mock; findOne: jest.Mock };

  beforeEach(async () => {
    mockRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: getRepositoryToken(User), useValue: mockRepository }],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUpdateUser', () => {
    it('deve criar um novo usuário com id gerado', async () => {
      mockRepository.save.mockResolvedValue({} as User);
      const data: Partial<IUser> = { name: 'Fulano', email: 'fulano@email.com' };
      const result = await service.createUpdateUser(data);
      expect(mockRepository.save).toHaveBeenCalledWith({ id: 'mocked-uuid-123', ...data });
      expect(result).toEqual({
        message: systemMessage.ReturnMessage.sucessCreateUser,
        statusCode: 200,
      });
    });

    it('deve atualizar usuário com id fornecido', async () => {
      mockRepository.save.mockResolvedValue({} as User);
      const data: Partial<IUser> = { id: '123', name: 'Fulano' };
      const result = await service.createUpdateUser(data);
      expect(mockRepository.save).toHaveBeenCalledWith({ id: '123', ...data });
      expect(result).toEqual({
        message: systemMessage.ReturnMessage.sucessCreateUser,
        statusCode: 200,
      });
    });

    it('deve lançar erro se o save falhar', async () => {
      mockRepository.save.mockRejectedValue(new Error('erro'));
      await expect(service.createUpdateUser({ name: 'X' })).rejects.toThrow('erro');
    });
  });

  describe('findOneUser', () => {
    it('deve retornar mensagem de erro se usuário não encontrado', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      const result = await service.findOneUser('email', 'naoexiste@email.com');
      expect(result).toEqual({
        statusCode: 400,
        message: systemMessage.ReturnMessage.errorUserNotFound,
      });
    });

    it('deve retornar usuário se encontrado', async () => {
      const user = {
        id: '1',
        name: 'Fulano',
        photo: 'foto.png',
        email: 'fulano@email.com',
        social_midia: 'twitter',
        notification: true,
      };
      mockRepository.findOne.mockResolvedValue(user);
      const result = await service.findOneUser('email', 'fulano@email.com');
      expect(result).toEqual({
        statusCode: 200,
        message: systemMessage.ReturnMessage.sucessGetPostById,
        user,
      });
    });
  });

  describe('findOneUserLogin', () => {
    it('deve retornar false se usuário não encontrado', async () => {
      mockRepository.findOne.mockResolvedValue(false);
      const result = await service.findOneUserLogin('naoexiste@email.com');
      expect(result).toBe(false);
    });
    it('deve retornar dados do usuário para login', async () => {
      const user = {
        id: '1',
        password: 'senha',
        name: 'Fulano',
        email: 'fulano@email.com',
        permission: 'admin',
        isActive: 'active',
      };
      mockRepository.findOne.mockResolvedValue(user);
      const result = await service.findOneUserLogin('fulano@email.com');
      expect(result).toEqual({
        id: '1',
        password: 'senha',
        name: 'Fulano',
        email: 'fulano@email.com',
        permission: 'admin',
        isActive: 'active',
      });
    });
  });
});
