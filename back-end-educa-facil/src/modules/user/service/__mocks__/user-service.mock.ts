import { IUser } from '../../entities/interfaces/user.interface';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { FindOneUserReturnMessageDTO } from '../../dtos/returnMessageCRUD.dto';
import { LoginUsuarioInternoDTO } from '@modules/user/dtos/AuthUser.dto';
import { UserPermissionEnum } from '../../../auth/Enum/permission.enum';
import { UserStatusEnum } from '../../enum/status.enum';

export const userMock: IUser = {
  id: '1',
  name: 'Test User',
  photo: 'photo.png',
  email: 'test@email.com',
  password: 'hashedpassword',
  permission: UserPermissionEnum.USER,
  notification: true,
  is_active: UserStatusEnum.ACTIVE,
  social_midia: { facebook: 'fb.com/test' },
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
    social_midia: userMock.social_midia!,
    notification: userMock.notification,
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
  permission: userMock.permission,
  isActive: userMock.is_active,
};
