import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDTO } from './DTOs/createPost.DTO';
import { systemMessage } from '@config/i18n/pt/systemMessage';

describe('PostService', () => {
  let service: PostService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let _repository: Repository<Post>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
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
    _repository = module.get<Repository<Post>>(getRepositoryToken(Post));
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

    const postCriado = { id: 'uuid', ...dto };
    mockRepository.create.mockReturnValue(postCriado);
    mockRepository.save.mockResolvedValue(postCriado);

    const result = await service.createPostService(dto);

    expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining(dto));
    expect(mockRepository.save).toHaveBeenCalledWith(postCriado);
    expect(result).toEqual({
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
});
