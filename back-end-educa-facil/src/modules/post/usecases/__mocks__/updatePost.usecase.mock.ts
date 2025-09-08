// Mocks para updatePost.usecase.spec.ts
import { UpdatePostDTO } from '@modules/post/dtos/updatePost.dto';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';

export const mockPostService = {
  updatePostService: jest.fn(),
};

export const mockUpdatePostDto: UpdatePostDTO = {
  id: 'post123',
  title: 'Novo título',
  description: '',
  content_hashtags: [],
  style_id: '',
  introduction: '',
  external_link: {},
  image: '',
};

export const mockReturnMessage: ReturnMessageDTO = {
  message: 'Post atualizado com sucesso',
  statusCode: 200,
};
