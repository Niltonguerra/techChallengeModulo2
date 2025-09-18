// Mocks para post.service.spec.ts
import { UserPermissionEnum } from '@modules/auth/Enum/permission.enum';
import { Post } from '@modules/post/entities/post.entity';
import { User } from '@modules/user/entities/user.entity';
import { UserStatusEnum } from '@modules/user/enum/status.enum';

export const mockUser: User = {
  id: 'user_id',
  name: 'nome',
  password: 'senha',
  photo: '',
  email: 'email@email.com',
  created_at: new Date(),
  updated_at: new Date(),
  is_active: UserStatusEnum.PENDING,
  permission: UserPermissionEnum.USER,
  posts: [],
};

export const mockPost: Post = {
  id: '1',
  title: 'titulo',
  description: 'desc',
  image: '',
  introduction: '',
  content_hashtags: [],
  external_link: { url: '' },
  created_at: new Date(),
  updated_at: new Date(),
  user: mockUser,
  updateSearchField: jest.fn(),
};

export const mockPostRepository = () => ({
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  createQueryBuilder: jest.fn(),
  delete: jest.fn(),
});
