import { createPostUseCase } from './createPost.usecase';
import { CreatePostDTO } from '../DTOs/createPost.DTO';
import { CreateReturnMessageDTO } from '../DTOs/returnMessage.DTO';
import { HttpException } from '@nestjs/common';

describe('createPostUseCase', () => {
  let useCase: createPostUseCase;

  const mockPostService = {
    createPostService: jest.fn(),
  };

  beforeEach(() => {
    useCase = new createPostUseCase(mockPostService as any);
    jest.clearAllMocks();
  });

  it('deve criar um post e retornar a mensagem de sucesso', async () => {
    const dto: CreatePostDTO = {
      title: 'Título',
      description: 'Descrição',
      authorId: 'autor123',
      image: 'imagem.jpg',
      search_field: [],
      scheduled_publication: '',
      content_hashtags: [],
      style_id: '',
    };

    const returnMessage: CreateReturnMessageDTO = {
      message: 'Post criado com sucesso',
      statusCode: 200,
    };

    mockPostService.createPostService.mockResolvedValue(returnMessage);

    const result = await useCase.createPostUseCase(dto);

    expect(mockPostService.createPostService).toHaveBeenCalledWith(dto);
    expect(result).toEqual(returnMessage);
  });

  it('deve lançar HttpException em caso de erro', async () => {
    const dto: CreatePostDTO = {
      title: 'Título',
      description: 'Descrição',
      authorId: 'autor123',
      image: 'imagem.jpg',
      search_field: [],
      scheduled_publication: '',
      content_hashtags: [],
      style_id: '',
    };

    mockPostService.createPostService.mockRejectedValue(new Error('Erro no service'));

    await expect(useCase.createPostUseCase(dto)).rejects.toThrow(HttpException);
    await expect(useCase.createPostUseCase(dto)).rejects.toThrow(
      'Erro ao criar o post: Erro no service',
    );
  });
});
