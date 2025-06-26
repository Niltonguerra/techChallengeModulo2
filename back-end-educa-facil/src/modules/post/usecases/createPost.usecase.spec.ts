import { HttpException, HttpStatus } from '@nestjs/common';
import { createPostUseCase } from './createPost.usecase';
import { PostService } from '../post.service';
import { CreatePostDTO } from '../DTOs/createPost.DTO';
import { CreateReturnMessageDTO } from '../DTOs/returnMessage.DTO';

describe('createPostUseCase', () => {
  let useCase: createPostUseCase;
  let postService: PostService;

  beforeEach(() => {
    postService = {
      createPostService: jest.fn(),
    } as unknown as PostService;
    useCase = new createPostUseCase(postService);
  });

  it('deve retornar mensagem de sucesso ao criar um post', async () => {
    const dto: CreatePostDTO = {
      title: 'Título válido para teste',
      description: 'Descrição válida para teste',
      search_field: ['busca1', 'busca2'],
      scheduled_publication: '2025-07-01T10:00:00Z',
      content_hashtags: ['#tag1', '#tag2'],
      style_id: 'default',
      author_id: 'b7e6b8e2-8d6a-4b2a-9e6a-123456789abc',
      image: 'https://meusite.com/imagem.jpg',
    };

    const returnMessage: CreateReturnMessageDTO = {
      message: 'Post criado com sucesso',
      statusCode: 200,
    };

    (postService.createPostService as jest.Mock).mockResolvedValue(returnMessage);

    await expect(useCase.createPostUseCase(dto)).resolves.toEqual(returnMessage);
    expect(postService.createPostService).toHaveBeenCalledWith(dto);
  });

  it('deve lançar HttpException em caso de erro', async () => {
    const dto = {} as CreatePostDTO;
    (postService.createPostService as jest.Mock).mockRejectedValue(new Error('Erro no service'));

    await expect(useCase.createPostUseCase(dto)).rejects.toThrow(HttpException);
    await expect(useCase.createPostUseCase(dto)).rejects.toThrow(
      'Erro ao criar o post: Erro no service',
    );
  });
});
