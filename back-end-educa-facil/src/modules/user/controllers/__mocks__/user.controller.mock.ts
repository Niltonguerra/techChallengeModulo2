import { UserPermissionEnum } from '@modules/auth/Enum/permission.enum';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { CreateUserDTO } from '@modules/user/dtos/createUser.dto';
import { FindOneUserQueryParamsDTO } from '@modules/user/dtos/findOneQueryParams.dto';
import { FindOneUserReturnMessageDTO } from '@modules/user/dtos/returnMessageCRUD.dto';
import { searchByFieldUserEnum } from '@modules/user/enum/searchByFieldUser.enum';

export const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

export const mockCreateUserUseCase = {
  validationEmailCreateUser: jest.fn(() => Promise.resolve()),
  create: jest.fn(() => Promise.resolve()),
};

export const mockFindOneUserUseCase = {
  findOneUserUseCase: jest.fn(() => Promise.resolve()),
};

export const mockAppGuard = {
  canActivate: () => true,
};

export const mockCreateUserDTO: CreateUserDTO = {
  email: 'test@email.com',
  password: '123',
  name: 'Test',
  photo: '',
  permission: UserPermissionEnum.ADMIN,
  notification: false,
};

export const mockReturnMessageDTO: ReturnMessageDTO = {
  message: 'ok',
  statusCode: 200,
};

export const mockToken = 'token123';

export const mockReturnMessageDTOValid: ReturnMessageDTO = {
  message: 'valid',
  statusCode: 200,
};

export const mockFindOneUserQuery: FindOneUserQueryParamsDTO = {
  field: searchByFieldUserEnum.EMAIL,
  value: 'test@email.com',
};

export const mockFindOneUserReturn: FindOneUserReturnMessageDTO = {
  statusCode: 200,
  message: 'ok',
  user: {
    id: '1',
    name: 'Test',
    photo: '',
    email: 'test@email.com',
    social_midia: {},
    notification: false,
  },
};
