import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { UserService } from '../service/user.service';
import { FindOneUserReturnMessageDTO } from '../dtos/returnMessageCRUD.dto';
import { FindOneUserQueryParamsDTO } from '../dtos/findOneQueryParams.dto';

@Injectable()
export class FindOneUserUseCase {
  private readonly logger = new Logger(FindOneUserUseCase.name);
  constructor(private readonly userService: UserService) {}

  async findOneUserUseCase(
    params: FindOneUserQueryParamsDTO,
  ): Promise<FindOneUserReturnMessageDTO> {
    try {
      const user = await this.userService.findOneUser(params.field, params.value);
      return user;
    } catch (error) {
      const message =
        error instanceof HttpException ? error.message : systemMessage.ReturnMessage.errorFindUser;
      const status =
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
      this.logger.error(`${message}: ${status}`);
      throw new HttpException(`${message}: ${status}`, status);
    }
  }
}
