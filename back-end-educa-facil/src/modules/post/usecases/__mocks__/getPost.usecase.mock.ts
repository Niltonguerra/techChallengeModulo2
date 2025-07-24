import { ReturnListPost } from '@modules/post/dtos/returnlistPost.dto';

export const mockPostService = {
  getById: jest.fn(),
};

export const postMock: ReturnListPost = {
  message: 'ok',
  statusCode: 200,
  limit: 10,
  offset: 0,
  total: 1,
  ListPost: [
    {
      id: 'id',
      title: 'Título',
      description: 'Descrição',
      image: 'img',
      introduction: 'intro',
      content_hashtags: ['#supera'],
      style_id: 'style',
      external_link: { instagram: 'insta' },
      created_at: new Date(),
      updated_at: new Date(),
      user_name: 'Lira',
      user_email: 'ls@gmail.com',
      user_social_media: {},
    },
  ],
};
