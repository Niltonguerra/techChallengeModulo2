export const successResponse = {
  statusCode: 200,
  message: 'Usuário criado com sucesso',
};
import { CreateUserDTO } from '../../dtos/createUser.dto';
import { UserPermissionEnum } from '../../../auth/Enum/permission.enum';
import { systemMessage } from '@config/i18n/pt/systemMessage';

export const mockCreateUserDTO: CreateUserDTO = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  photo: 'https://example.com/photo.jpg',
  social_midia: { twitter: '@testuser' },
  permission: UserPermissionEnum.USER,
  notification: true,
};

export const notFoundResponse = {
  statusCode: 400,
  message: systemMessage?.ReturnMessage?.errorUserNotFound ?? 'Usuário não encontrado',
};

export const successValidationEmailResponse = {
  statusCode: 201,
  message:
    systemMessage?.ReturnMessage?.sucessCreateUserValidationEmail ??
    'Usuário criado com sucesso, verifique seu e-mail',
};

export const existingUserResponse = {
  statusCode: 200,
  message: systemMessage?.ReturnMessage?.sucessGetPostById ?? 'Usuário já existe',
  user: {
    id: '1',
    name: 'Existing User',
    email: 'test@example.com',
    photo: 'https://example.com/photo.jpg',
    social_midia: { twitter: '@existing' },
    notification: true,
  },
};

export const foundUserResponse = {
  statusCode: 200,
  message: systemMessage?.ReturnMessage?.sucessGetPostById ?? 'Usuário encontrado',
  user: {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    photo: 'https://example.com/photo.jpg',
    social_midia: { twitter: '@testuser' },
    notification: true,
  },
};

export const responseWithoutUser = {
  statusCode: 200,
  message: 'Some message',
};
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { FindOneUserReturnMessageDTO } from '../../dtos/returnMessageCRUD.dto';

export const existingUserReturnMock: FindOneUserReturnMessageDTO = {
  statusCode: 200,
  message: 'Usuário já existe',
  user: {
    id: '1',
    name: 'Novo Usuário',
    photo: '',
    email: 'new@email.com',
    social_midia: {},
    notification: true,
  },
};

export const notFoundUserReturnMock: FindOneUserReturnMessageDTO = {
  statusCode: 400,
  message: 'Usuário não encontrado',
};

export const successValidationEmailReturnMock: ReturnMessageDTO = {
  statusCode: 201,
  message: 'Usuário criado com sucesso, verifique seu e-mail',
};

export const successCreateReturnMock: ReturnMessageDTO = {
  statusCode: 201,
  message: 'Usuário criado com sucesso',
};
