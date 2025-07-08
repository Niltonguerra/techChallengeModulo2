import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { UserService } from '../service/user.service';
import { FindOneUserReturnMessageDTO } from '../dtos/returnMessageCRUD.dto';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';

@Injectable()
export class FindOneUserUseCase {
  constructor(private readonly userService: UserService) {}

  async findOneUserUseCase(
    field: string,
    value: string,
  ): Promise<FindOneUserReturnMessageDTO | ReturnMessageDTO> {
    try {
      const user = await this.userService.findOneUser(field, value);
      return user;
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : systemMessage.ReturnMessage.errorUserNotFound;
      throw new HttpException(
        `Erro ao encontrar o usuário: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
