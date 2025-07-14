import { GetPostDTO } from '../DTOs/getPost.DTO';
import { HttpException } from '@nestjs/common';
import { GetPostUseCase } from './getPost.usecase';

describe('GetPostByIdUseCase', () => {
  let useCase: GetPostUseCase;

  const mockPostService = {
    getById: jest.fn(),
  };

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    useCase = new GetPostUseCase(mockPostService as any);
    jest.clearAllMocks();
  });

  it('deve retornar um post quando encontrado pelo ID', async () => {
    const postMock: GetPostDTO = {
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
    };

    mockPostService.getById.mockResolvedValue(postMock);

    const result = await useCase.getPostUseCaseById('f9a7feed-37f4-4764-8f18-9cd74cfa7f54');

    expect(mockPostService.getById).toHaveBeenCalledWith('f9a7feed-37f4-4764-8f18-9cd74cfa7f54');
    expect(result).toEqual(postMock);
  });

  it('deve lançar HttpException em caso de erro', async () => {
    mockPostService.getById.mockRejectedValue(new Error('Erro no get'));

    await expect(
      useCase.getPostUseCaseById('f9a7feed-37f4-4764-8f18-9cd74cfa7f54'),
    ).rejects.toThrow(HttpException);
    await expect(
      useCase.getPostUseCaseById('f9a7feed-37f4-4764-8f18-9cd74cfa7f54'),
    ).rejects.toThrow('Erro ao buscar o post: Erro no get');
  });
});
