import { Test, TestingModule } from '@nestjs/testing';
import { listPostUseCase } from './listPost.usecase';
import { PostService } from '../post.service';
import { ReturnListPostDTO } from '../DTOs/returnlistPost.DTO';

describe('listPostUseCase', () => {
  let useCase: listPostUseCase;
  let postService: PostService;

  const mockPostService = {
    listPosts: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        listPostUseCase,
        {
          provide: PostService,
          useValue: mockPostService,
        },
      ],
    }).compile();

    useCase = module.get<listPostUseCase>(listPostUseCase);
    postService = module.get<PostService>(PostService);
  });

  it('deve retornar a lista de posts com os campos esperados', async () => {
    const mockData: ReturnListPostDTO[] = [
      {
        title: 'Post 1',
        description: 'Descrição 1',
        introduction: 'Descrição 1',
        external_link: '',
        content_hashtags: [],
        style_id: '',
        image: 'img.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
        total_post: 1,
        author_id: {
          name: '',
          email: '',
          social_midia: '',
        },
      },
    ];

    jest.spyOn(postService, 'listPosts').mockResolvedValue(mockData);

    const result = await useCase.execute({ offset: 0, limit: 10 });

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Post 1');
    expect(result[0].introduction).toContain('Descrição');
  });
});
