import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { Post } from '../entities/post.entity';
import { Repository } from 'typeorm';
import { UpdatePostDTO } from '../dtos/updatePost.dto';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { mockPost, mockPostRepository } from './__mocks__/post.service.mock';
import { ListPost } from '../dtos/returnlistPost.dto';

describe('PostService', () => {
  let service: PostService;
  let postRepository: jest.Mocked<Repository<Post>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Post),
          useFactory: mockPostRepository,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    postRepository = module.get(getRepositoryToken(Post));
  });

  describe('listPosts', () => {
    it('deve retornar lista de posts', async () => {
      const mockQueryBuilder: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockPost], 1]),
      };
      postRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      const result = await service.listPosts();
      expect(result.statusCode).toBe(200);
      expect(result.total).toBe(1);
      expect(Array.isArray(result.ListPost)).toBe(true);
    });

    it('deve retornar lista vazia se não houver posts', async () => {
      const mockQueryBuilder: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };
      postRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      const result = await service.listPosts();
      expect(result.statusCode).toBe(200);
      expect(result.total).toBe(0);
      expect(Array.isArray(result.ListPost)).toBe(true);
      if (Array.isArray(result.ListPost)) {
        expect(result.ListPost.length).toBe(0);
      } else {
        expect(result.ListPost).toBeUndefined();
      }
    });

    it('deve filtrar posts por múltiplos termos de busca', async () => {
      const mockQueryBuilder: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockPost], 1]),
      };
      postRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      const result = await service.listPosts('foo,bar');
      expect(result.statusCode).toBe(200);
      expect(result.total).toBe(1);
      expect(Array.isArray(result.ListPost)).toBe(true);
    });

    it('deve respeitar offset e limit', async () => {
      const mockQueryBuilder: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockPost], 1]),
      };
      postRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      const result = await service.listPosts('', 5, 2);
      expect(result.limit).toBe(2);
      expect(result.offset).toBe(5);
    });
  });

  describe('updatePostService', () => {
    it('deve atualizar um post', async () => {
      postRepository.findOneBy.mockResolvedValue(mockPost);
      postRepository.save.mockResolvedValue(mockPost);
      const dto: UpdatePostDTO = { id: '1', title: 'novo' } as UpdatePostDTO;
      const result = await service.updatePostService(dto);
      expect(result.message).toBe(systemMessage.ReturnMessage.sucessUpdatePost);
      expect(result.statusCode).toBe(200);
    });
    it('deve lançar exceção se post não existir', async () => {
      postRepository.findOneBy.mockResolvedValue(null);
      const dto: UpdatePostDTO = { id: '1', title: 'novo' } as UpdatePostDTO;
      await expect(service.updatePostService(dto)).rejects.toThrow();
    });

    it('deve atualizar apenas campos fornecidos', async () => {
      // Fazendo clone profundo e mantendo o método updateSearchField
      const postClone: Post = {
        ...mockPost,
        updateSearchField: jest.fn(),
      };
      postRepository.findOneBy.mockResolvedValue(postClone);
      postRepository.save.mockResolvedValue({
        ...postClone,
        title: 'novo',
        updateSearchField: jest.fn(),
      });
      const dto: UpdatePostDTO = { id: '1', title: 'novo' } as UpdatePostDTO;
      await service.updatePostService(dto);
      expect(postClone.title).toBe('novo');
    });
  });

  describe('createPostService', () => {
    it('deve criar um post com sucesso', async () => {
      postRepository.findOneBy.mockResolvedValue(null);
      postRepository.create.mockReturnValue(mockPost);
      postRepository.save.mockResolvedValue(mockPost);
      const dto = { title: 'titulo', user_id: 'user_id', description: 'desc' };
      const result = await service.createPostService(dto as any);
      expect(result.message).toBe(systemMessage.ReturnMessage.sucessCreatePost);
      expect(result.statusCode).toBe(200);
    });
    it('deve lançar exceção se já existir post com o mesmo título', async () => {
      postRepository.findOneBy.mockResolvedValue(mockPost);
      const dto = { title: 'titulo', user_id: 'user_id', description: 'desc' };
      await expect(service.createPostService(dto as any)).rejects.toThrow();
    });

    it('deve associar o usuário correto ao criar post', async () => {
      postRepository.findOneBy.mockResolvedValue(null);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      const createSpy = jest.fn().mockImplementation((data) => data);
      postRepository.create.mockImplementation(createSpy);
      postRepository.save.mockResolvedValue(mockPost);
      const dto = { title: 'titulo', user_id: 'user_id', description: 'desc' };
      await service.createPostService(dto as any);
      expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({ user: { id: 'user_id' } }));
    });

    it('deve chamar logger em caso de erro de título duplicado', async () => {
      const loggerErrorSpy = jest.spyOn(service['logger'], 'error');
      postRepository.findOneBy.mockResolvedValue(mockPost);
      const dto = { title: 'titulo', user_id: 'user_id', description: 'desc' };
      await expect(service.createPostService(dto as any)).rejects.toThrow();
      expect(loggerErrorSpy).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('deve retornar post por id', async () => {
      const mockQueryBuilder: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockPost),
      };
      postRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      const result = await service.getById('1');
      expect(result.statusCode).toBe(200);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect((result.ListPost as ListPost[])[0].id).toBe('1');
    });
    it('deve lançar exceção se post não existir', async () => {
      const mockQueryBuilder: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      postRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      await expect(service.getById('1')).rejects.toThrow();
    });

    it('deve chamar logger em caso de erro', async () => {
      const loggerErrorSpy = jest.spyOn(service['logger'], 'error');
      const mockQueryBuilder: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      postRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      await expect(service.getById('1')).rejects.toThrow();
      expect(loggerErrorSpy).toHaveBeenCalled();
    });
  });

  describe('getByField', () => {
    it('deve retornar post por campo', async () => {
      const mockQueryBuilder: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockPost),
      };
      postRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      const result = await service.getByField('title' as any, 'titulo');
      expect(result.statusCode).toBe(200);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect((result.ListPost as ListPost[])[0].id).toBe('1');
    });
    it('deve retornar erro se não encontrar post', async () => {
      const mockQueryBuilder: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      postRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      const result = await service.getByField('title' as any, 'titulo');
      expect(result.statusCode).toBe(404);
    });

    it('deve retornar erro se campo for inválido', async () => {
      // Simula um erro de query
      const mockQueryBuilder: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockImplementation(() => {
          throw new Error('Campo inválido');
        }),
        getOne: jest.fn(),
      };
      postRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      await expect(service.getByField('campo_invalido' as any, 'valor')).rejects.toThrow(
        'Campo inválido',
      );
    });
  });

  describe('deletePostService', () => {
    it('deve deletar post com sucesso', async () => {
      postRepository.delete.mockResolvedValue({ affected: 1 } as any);
      const result = await service.deletePostService('1');
      expect(result.message).toBe(systemMessage.ReturnMessage.sucessDeletePost);
      expect(result.statusCode).toBe(200);
    });
    it('deve lançar exceção se não encontrar post para deletar', async () => {
      postRepository.delete.mockResolvedValue({ affected: 0 } as any);
      await expect(service.deletePostService('1')).rejects.toThrow();
    });

    it('deve chamar logger em caso de erro ao deletar', async () => {
      const loggerErrorSpy = jest.spyOn(service['logger'], 'error');
      postRepository.delete.mockResolvedValue({ affected: 0 } as any);
      await expect(service.deletePostService('1')).rejects.toThrow();
      expect(loggerErrorSpy).toHaveBeenCalled();
    });
  });
});
