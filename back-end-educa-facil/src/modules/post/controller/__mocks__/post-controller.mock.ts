import { JwtPayload } from '@modules/auth/dtos/JwtPayload.dto';
import { CreatePostDTO } from '@modules/post/dtos/createPost.dto';
import { UpdatePostDTO } from '@modules/post/dtos/updatePost.dto';

export const listPostDTOMock = { page: 1, limit: 10 };
export const returnListPostMock = { posts: [{ id: 'abc123', title: 'Post' }], total: 1 };

export const createPostDTOMock: CreatePostDTO = {
  title: 'Novo post',
  user_id: '',
  description: '',
  search_field: [],
  scheduled_publication: '',
  content_hashtags: [],
  style_id: '',
};
export const jwtPayloadMock: JwtPayload = {
  id: 'user1',
  email: '',
  permission: '',
};
export const returnMessageCreateMock = { statusCode: 201, message: 'Criado' };

export const updatePostDTOMock: UpdatePostDTO = {
  id: 'abc123',
  title: 'Atualizado',
  description: 'Descrição atualizada',
};
export const returnMessageUpdateMock = { statusCode: 200, message: 'Atualizado' };

export const returnMessageDeleteMock = { statusCode: 200, message: 'Deletado' };
