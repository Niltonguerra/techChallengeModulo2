import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { FindOneUserReturnMessageDTO } from '../dtos/returnMessageCRUD.dto';

export const returnMessageOkMock: ReturnMessageDTO = {
  message: 'ok',
  statusCode: 200,
};

export const returnMessageValidMock: ReturnMessageDTO = {
  message: 'valid',
  statusCode: 200,
};

export const findOneUserReturnMock: FindOneUserReturnMessageDTO = {
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
