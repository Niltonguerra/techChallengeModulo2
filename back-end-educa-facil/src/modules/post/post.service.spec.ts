import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { CreatePostDTO } from './DTOs/createPost.DTO';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { CreateReturnMessageDTO, DeleteReturnMessageDTO } from './DTOs/returnMessage.DTO';

describe('PostService', () => {
  let service: PostService;
  let repository: Repository<Post>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    repository = module.get<Repository<Post>>(getRepositoryToken(Post));
    jest.clearAllMocks();
  });

  it('deve criar um post e retornar mensagem de sucesso', async () => {
    const dto: CreatePostDTO = {
      title: 'Título',
      description: 'Descrição',
      author_id: 'autor123',
      image: 'imagem.jpg',
      search_field: [],
      scheduled_publication: '',
      content_hashtags: [],
      style_id: '',
    };

    const postCriado = { id: 'uuid', ...dto } as unknown as Post;
    mockRepository.create.mockReturnValue(postCriado);
    mockRepository.save.mockResolvedValue(postCriado);

    const result = await service.createPostService(dto);

    expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining(dto));
    expect(mockRepository.save).toHaveBeenCalledWith(postCriado);
    expect(result).toEqual<CreateReturnMessageDTO>({
      message: systemMessage.ReturnMessage.sucessPost,
      statusCode: 200,
    });
  });

  it('deve listar todos os posts', async () => {
    const posts = [
      { id: 'uuid1', title: 'Post 1', description: 'Desc 1' },
      { id: 'uuid2', title: 'Post 2', description: 'Desc 2' },
    ] as Post[];
    mockRepository.find.mockResolvedValue(posts);

    const result = await service.listar();

    expect(mockRepository.find).toHaveBeenCalled();
    expect(result).toEqual(posts);
  });

  it('deve deletar um post existente e retornar mensagem de sucesso', async () => {
    const postExistente = { id: 'uuid-del', title: 'Post a deletar' } as Post;
    mockRepository.findOne.mockResolvedValue(postExistente);
    mockRepository.remove.mockResolvedValue(postExistente);

    const result = await service.deletePostService('uuid-del');

    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-del' } });
    expect(mockRepository.remove).toHaveBeenCalledWith(postExistente);
    expect(result).toEqual<DeleteReturnMessageDTO>({
      message: systemMessage.ReturnMessage.sucessDeletePost,
      statusCode: 200,
    });
  });

  it('deve lançar exceção ao tentar deletar um post inexistente', async () => {
    mockRepository.findOne.mockResolvedValue(null);

    await expect(service.deletePostService('uuid-inexistente')).rejects.toThrow(
      new HttpException('Post not found', 404),
    );

    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-inexistente' } });
    expect(mockRepository.remove).not.toHaveBeenCalled();
  });
});