import { CreateUserDTO } from '../dtos/createUser.dto';
import { UserPermissionEnum } from '../enum/permission.enum';
import { FindOneUserQueryParamsDTO } from '../dtos/findOneQueryParams.dto';
import { searchByFieldUserEnum } from '../enum/searchByFieldUser.enum';

export const createUserDtoMock: CreateUserDTO = {
  email: 'test@email.com',
  password: '123',
  name: 'Test',
  photo: '',
  permission: UserPermissionEnum.ADMIN,
  notification: false,
};

export const createUserDtoFailMock: CreateUserDTO = {
  email: 'fail@email.com',
  password: '123',
  name: 'Fail',
  photo: '',
  permission: UserPermissionEnum.ADMIN,
  notification: false,
};

export const findOneUserQueryMock: FindOneUserQueryParamsDTO = {
  field: searchByFieldUserEnum.EMAIL,
  value: 'test@email.com',
};

export const findOneUserQueryFailMock: FindOneUserQueryParamsDTO = {
  field: searchByFieldUserEnum.EMAIL,
  value: 'x',
};
