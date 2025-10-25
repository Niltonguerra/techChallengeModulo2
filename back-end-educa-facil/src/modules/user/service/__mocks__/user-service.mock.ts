import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { LoginUsuarioInternoDTO } from '@modules/user/dtos/AuthUser.dto';
import { UserPermissionEnum } from '../../../auth/Enum/permission.enum';
import { FindOneUserReturnMessageDTO } from '../../dtos/returnMessageCRUD.dto';
import { UserStatusEnum } from '../../enum/status.enum';
import { IUser } from '@modules/user/interfaces/user.interface';

export const userMock: IUser = {
  id: '1',
  name: 'Test User',
  photo: 'photo.png',
  email: 'test@email.com',
  password: 'hashedpassword',
  permission: UserPermissionEnum.USER,
  is_active: UserStatusEnum.ACTIVE,
};

export const userCreateMock: Partial<IUser> = {
  name: 'New User',
  email: 'new@email.com',
  password: 'newpassword',
};

export const returnMessageCreateMock: ReturnMessageDTO = {
  message: 'Usuário criado com sucesso',
  statusCode: 200,
};

export const returnMessageFindOneMock: FindOneUserReturnMessageDTO = {
  statusCode: 200,
  message: 'Usuário encontrado com sucesso',
  user: {
    id: userMock.id,
    name: userMock.name,
    photo: userMock.photo,
    email: userMock.email,
  },
};

export const returnMessageNotFoundMock: FindOneUserReturnMessageDTO = {
  statusCode: 400,
  message: 'Usuário não encontrado',
};

export const loginUsuarioInternoMock: LoginUsuarioInternoDTO = {
  id: userMock.id,
  password: userMock.password,
  name: userMock.name,
  email: userMock.email,
  permission: UserPermissionEnum.USER,
  isActive: UserStatusEnum.ACTIVE,
  photo: userMock.photo,
};
