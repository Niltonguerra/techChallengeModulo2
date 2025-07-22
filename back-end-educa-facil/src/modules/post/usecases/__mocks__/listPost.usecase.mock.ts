// Mocks para listPost.usecase.spec.ts
import { ReturnListPost } from '@modules/post/dtos/returnlistPost.dto';

export const mockPostService = {
  listPosts: jest.fn(),
};

export const mockListPostData: ReturnListPost = {
  message: 'ok',
  statusCode: 200,
  limit: 10,
  offset: 0,
  total: 1,
  ListPost: [
    {
      id: 'id',
      title: 'Post 1',
      description: 'Descrição 1',
      image: 'img.jpg',
      introduction: 'Descrição 1',
      content_hashtags: [],
      style_id: '',
      external_link: {},
      created_at: new Date(),
      updated_at: new Date(),
      user_name: '',
      user_email: '',
      user_social_media: {},
    },
  ],
};
