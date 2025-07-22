// Mocks para post.service.spec.ts
import { User } from '@modules/user/entities/user.entity';
import { UserStatusEnum } from '@modules/user/enum/status.enum';
import { UserPermissionEnum } from '@modules/auth/Enum/permission.enum';
import { Post } from '@modules/post/entities/post.entity';

export const mockUser: User = {
  id: 'user_id',
  name: 'nome',
  password: 'senha',
  photo: '',
  email: 'email@email.com',
  social_midia: {},
  created_at: new Date(),
  updated_at: new Date(),
  is_active: UserStatusEnum.PENDING,
  permission: UserPermissionEnum.USER,
  notification: false,
  posts: [],
};

export const mockPost: Post = {
  id: '1',
  title: 'titulo',
  description: 'desc',
  image: '',
  introduction: '',
  content_hashtags: [],
  style_id: '',
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
