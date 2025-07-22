import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { CreatePostDTO } from '@modules/post/dtos/createPost.dto';

export const mockPostService = {
  createPostService: jest.fn(),
};

export const validDto: CreatePostDTO = {
  title: 'Título',
  description: 'Descrição',
  user_id: 'autor123',
  image: 'imagem.jpg',
  search_field: [],
  scheduled_publication: '',
  content_hashtags: [],
  style_id: '',
};

export const mockReturnMessage: ReturnMessageDTO = {
  message: 'Post criado com sucesso',
  statusCode: 200,
};
