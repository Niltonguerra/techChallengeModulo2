import { Test, TestingModule } from '@nestjs/testing';
import { listPostUseCase } from './listPost.usecase';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { Repository } from 'typeorm';

describe('listPostUseCase', () => {
  let useCase: listPostUseCase;
  let mockRepo: Partial<Repository<Post>>;

  beforeEach(async () => {
    mockRepo = {
      findAndCount: jest.fn().mockResolvedValue([
        [
          {
            title: 'Post 1',
            description: 'Descrição 1',
            image: 'img.jpg',
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        1,
      ]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        listPostUseCase,
        {
          provide: getRepositoryToken(Post),
          useValue: mockRepo,
        },
      ],
    }).compile();

    useCase = module.get<listPostUseCase>(listPostUseCase);
  });

  it('deve retornar a lista de posts com os campos esperados', async () => {
    const result = await useCase.execute({ offset: 0, limit: 10 });

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Post 1');
    expect(result[0].introduction).toContain('Descrição');
  });
});
