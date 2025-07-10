import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { createPostUseCase } from './usecases/createPost.usecase';
import { GetPostUseCase } from './usecases/getPost.usecase';
import { CreatePostDTO } from './DTOs/createPost.DTO';
import { CreateReturnMessageDTO } from './DTOs/returnMessage.DTO';
import { DeletePostUseCase } from './usecases/deletePost.usecase';
import { GetPostDTO } from './DTOs/getPost.DTO';

describe('PostController', () => {
  let controller: PostController;

  // Mocks dos use cases
  const mockCreatePostUseCase = {
    createPostUseCase: jest.fn(),
  };
  const mockDeletePostUseCase = {
    deletePostUseCase: jest.fn(),
  };

  const mockGetPostUseCase = {
    getPostUseCaseById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        { provide: createPostUseCase, useValue: mockCreatePostUseCase },
        { provide: DeletePostUseCase, useValue: mockDeletePostUseCase },
        { provide: GetPostUseCase, useValue: mockGetPostUseCase },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  describe('CreatePost', () => {
    const dto: CreatePostDTO = {
      title: 'Título',
      description: 'Descrição',
      authorId: 'autor123',
      image: 'imagem.jpg',
      search_field: ['campo1', 'campo2'],
      scheduled_publication: '2025-07-10T10:00:00Z',
      content_hashtags: ['#tag1', '#tag2'],
      style_id: 'style123',
    };

    it('deve criar um post e retornar a mensagem de sucesso', async () => {
      const returnMessage: CreateReturnMessageDTO = {
        message: 'Post criado com sucesso',
        statusCode: 200,
      };

      mockCreatePostUseCase.createPostUseCase.mockResolvedValue(returnMessage);

      const result = await controller.CreatePost(dto);

      expect(mockCreatePostUseCase.createPostUseCase).toHaveBeenCalledWith(dto);
      expect(result).toEqual(returnMessage);
    });

    it('deve propagar erro quando use case lançar exceção', async () => {
      const error = new Error('Erro interno');
      mockCreatePostUseCase.createPostUseCase.mockRejectedValue(error);

      await expect(controller.CreatePost(dto)).rejects.toThrowError('Erro interno');
      expect(mockCreatePostUseCase.createPostUseCase).toHaveBeenCalledWith(dto);
    });
  });

  describe('DeletePost', () => {
    const params: string = 'post123';


    it('deve deletar um post e retornar a mensagem de sucesso', async () => {
      const returnMessage: CreateReturnMessageDTO = {
        message: 'Post deletado com sucesso',
        statusCode: 200,
      };

      mockDeletePostUseCase.deletePostUseCase.mockResolvedValue(returnMessage);

      const result = await controller.deletePost(params);

      expect(mockDeletePostUseCase.deletePostUseCase).toHaveBeenCalledWith(params);
      expect(result).toEqual(returnMessage);
    });

    it('deve propagar erro quando use case lançar exceção', async () => {
      const error = new Error('Falha ao deletar');
      mockDeletePostUseCase.deletePostUseCase.mockRejectedValue(error);

      await expect(controller.deletePost(params)).rejects.toThrowError('Falha ao deletar');
      expect(mockDeletePostUseCase.deletePostUseCase).toHaveBeenCalledWith(params);
    });
  });

  describe('getById', () => {
    const id = 'post123';
    const posts: GetPostDTO[] = [
      {
        title: 'Título',
        description: 'Descrição',
        external_link: {
          instagram: 'https://instagram.com/exemplo',
          youtube: 'https://youtube.com/exemplo',
          tiktok: 'https://tiktok.com/@exemplo',
        },
        search_field: ['arra'],
        introduction: 'fjojoga gelfjrd',
        content_hashtags: ['#supera'],
        style_id: 'feijfo4t9wrrwifb314',
        image: 'https://i.pinimg.com/736x/54/f9/25/54f925d3aeeefa1405dea76357f00da2.jpg',
        created_at: new Date('2025-04-01'),
        updated_at: new Date('2025-04-16'),
        author_name: 'Lira da Silva',
        author_email: 'ls@gmail.com',
      }
    ];

    it('should call use case and return array of posts', async () => {
      mockGetPostUseCase.getPostUseCaseById.mockResolvedValue(posts);

      const result = await controller.getById(id);

      expect(mockGetPostUseCase.getPostUseCaseById).toHaveBeenCalledWith(id);
      expect(result).toEqual(posts);
    });

    it('should propagate errors from the use case', async () => {
      const error = new Error('Falha ao buscar post');
      mockGetPostUseCase.getPostUseCaseById.mockRejectedValue(error);

      await expect(controller.getById(id)).rejects.toThrow(error);
      expect(mockGetPostUseCase.getPostUseCaseById).toHaveBeenCalledWith(id);
    });
  });
});