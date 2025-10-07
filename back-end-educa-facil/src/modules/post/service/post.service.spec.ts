import { systemMessage } from '@config/i18n/pt/systemMessage';
import { User } from '@modules/user/entities/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ListPost } from '../dtos/returnlistPost.dto';
import { UpdatePostDTO } from '../dtos/updatePost.dto';
import { Post } from '../entities/post.entity';
import { mockPost, mockPostRepository } from './__mocks__/post.service.mock';
import { PostService } from './post.service';

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
      const mockQueryBuilder: Partial<SelectQueryBuilder<Post>> = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockPost], 1]),
      };
      (postRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder as SelectQueryBuilder<Post>,
      );
      const result = await service.listPosts({ offset: '0', limit: '10' });
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
      (postRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder as SelectQueryBuilder<Post>,
      );
      const result = await service.listPosts({ offset: '0', limit: '10' });
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
      (postRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder as SelectQueryBuilder<Post>,
      );
      const result = await service.listPosts({ offset: '0', limit: '10', search: 'foo,bar' });
      expect(result.statusCode).toBe(200);
      expect(result.total).toBe(1);
      expect(Array.isArray(result.ListPost)).toBe(true);
    });

    it('deve respeitar offset e limit', async () => {
      // Mock de um post
      const mockUser = {
        name: 'Usuario Teste',
        email: 'teste@teste.com',
      } as unknown as User;

      const mockPost: Post = {
        id: 'dsad1',
        title: 'Post teste',
        description: 'Descrição do post',
        image: 'imagem.png',
        introduction: 'introduction',
        content_hashtags: ['#teste'],
        external_link: { url: '' },
        created_at: new Date(),
        updated_at: new Date(),
        user: mockUser,
        updateSearchField: jest.fn(), // <-- aqui
      };

      // Mock do QueryBuilder, tipado com Partial
      const mockQueryBuilder: Partial<SelectQueryBuilder<Post>> = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockPost], 1]),
      };

      postRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as SelectQueryBuilder<Post>,
      );

      // Chamando o método com offset e limit específicos
      const result = await service.listPosts({ limit: '2', offset: '5' });

      // Verifica se skip e take foram chamados corretamente
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(5);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(2);

      // Verifica os valores retornados
      expect(result.limit).toBe(2);
      expect(result.offset).toBe(5);
      expect(result.total).toBe(1);
      expect(result.ListPost).toBeDefined();
      expect(result.ListPost!.length).toBe(1);

      // Verifica campos do post retornado
      expect(result.ListPost![0]).toEqual({
        id: 'dsad1',
        title: 'Post teste',
        description: 'Descrição do post',
        image: 'imagem.png',
        introduction: 'introduction', // fallback do introduction
        content_hashtags: ['#teste'],
        external_link: { url: '' }, // fallback do external_link
        created_at: mockPost.created_at,
        updated_at: mockPost.updated_at,
        user_name: 'Usuario Teste',
        user_email: 'teste@teste.com',
      });
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

      const dto = {
        title: 'title',
        description: 'description',
        introduction: 'introduction',
        external_link: { external_link: 'external_link' },
        content_hashtags: ['content_hashtags'],
        image: 'image',
        user_id: 'user_id',
      };
      const result = await service.createPostService(dto);
      expect(result.message).toBe(systemMessage.ReturnMessage.sucessCreatePost);
      expect(result.statusCode).toBe(200);
    });
    it('deve lançar exceção se já existir post com o mesmo título', async () => {
      postRepository.findOneBy.mockResolvedValue(mockPost);
      const dto = {
        title: 'title',
        description: 'description',
        introduction: 'introduction',
        external_link: { external_link: 'external_link' },
        content_hashtags: ['content_hashtags'],
        image: 'image',
        user_id: 'user_id',
      };
      await expect(service.createPostService(dto)).rejects.toThrow();
    });

    it('deve associar o usuário correto ao criar post', async () => {
      postRepository.findOneBy.mockResolvedValue(null);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      const createSpy = jest.fn().mockImplementation((data) => data);
      postRepository.create.mockImplementation(createSpy);
      postRepository.save.mockResolvedValue(mockPost);
      const dto = {
        title: 'title',
        description: 'description',
        introduction: 'introduction',
        external_link: { external_link: 'external_link' },
        content_hashtags: ['content_hashtags'],
        image: 'image',
        user_id: 'user_id',
      };
      await service.createPostService(dto);
      expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({ user: { id: 'user_id' } }));
    });

    it('deve chamar logger em caso de erro de título duplicado', async () => {
      const loggerErrorSpy = jest.spyOn(service['logger'], 'error');
      postRepository.findOneBy.mockResolvedValue(mockPost);
      const dto = {
        title: 'title',
        description: 'description',
        introduction: 'introduction',
        external_link: { external_link: 'external_link' },
        content_hashtags: ['content_hashtags'],
        image: 'image',
        user_id: 'user_id',
      };
      await expect(service.createPostService(dto)).rejects.toThrow();
      expect(loggerErrorSpy).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('deve retornar post por id', async () => {
      const mockQueryBuilder: Partial<SelectQueryBuilder<Post>> = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockPost),
      };
      (postRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);
      const result = await service.getById('1');
      expect(result.statusCode).toBe(200);

      expect((result.ListPost as ListPost[])[0].id).toBe('1');
    });
    it('deve lançar exceção se post não existir', async () => {
      const mockQueryBuilder: Partial<SelectQueryBuilder<Post>> = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      (postRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);
      await expect(service.getById('1')).rejects.toThrow();
    });

    it('deve chamar logger em caso de erro', async () => {
      const loggerErrorSpy = jest.spyOn(service['logger'], 'error');
      const mockQueryBuilder: Partial<SelectQueryBuilder<Post>> = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      (postRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);
      await expect(service.getById('1')).rejects.toThrow();
      expect(loggerErrorSpy).toHaveBeenCalled();
    });
  });

  describe('deletePostService', () => {
    it('deve deletar post com sucesso', async () => {
      postRepository.delete.mockResolvedValue({ raw: {}, affected: 1 });
      const result = await service.deletePostService('1');
      expect(result.message).toBe(systemMessage.ReturnMessage.sucessDeletePost);
      expect(result.statusCode).toBe(200);
    });
    it('deve lançar exceção se não encontrar post para deletar', async () => {
      postRepository.delete.mockResolvedValue({ raw: {}, affected: 0 });
      await expect(service.deletePostService('1')).rejects.toThrow();
    });

    it('deve chamar logger em caso de erro ao deletar', async () => {
      const loggerErrorSpy = jest.spyOn(service['logger'], 'error');
      postRepository.delete.mockResolvedValue({ raw: {}, affected: 0 });
      await expect(service.deletePostService('1')).rejects.toThrow();
      expect(loggerErrorSpy).toHaveBeenCalled();
    });
  });
});
