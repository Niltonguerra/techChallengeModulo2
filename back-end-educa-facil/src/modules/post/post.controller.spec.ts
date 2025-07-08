import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { createPostUseCase } from './usecases/createPost.usecase';
import { CreatePostDTO } from './DTOs/createPost.DTO';
import { CreateReturnMessageDTO } from './DTOs/returnMessage.DTO';
import { DeletePostUseCase } from './usecases/deletePost.usecase';

describe('PostController', () => {
  let controller: PostController;

  // Mocks dos use cases
  const mockCreatePostUseCase = {
    createPostUseCase: jest.fn(),
  };
  const mockDeletePostUseCase = {
    deletePostUseCase: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        { provide: createPostUseCase, useValue: mockCreatePostUseCase },
        { provide: DeletePostUseCase, useValue: mockDeletePostUseCase },
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
      author_id: 'autor123',
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
});
