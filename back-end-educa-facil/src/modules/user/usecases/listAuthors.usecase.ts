import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { UserService } from '../service/user.service';
import { ListUserReturnMessageDTO } from '../dtos/returnMessageCRUD.dto';
import { listAuthorsParamsDTO } from '../dtos/listAuthorsParams.dto';

@Injectable()
export class listAuthorsUseCase {
  private readonly logger = new Logger(listAuthorsUseCase.name);
  constructor(private readonly userService: UserService) {}

  async listAuthors(params: listAuthorsParamsDTO): Promise<ListUserReturnMessageDTO> {
    try {
      const users = await this.userService.listAuthors(params.field || '', params.value || '');
      return users;
    } catch (error) {
      const message =
        error instanceof HttpException
          ? error.message
          : systemMessage.ReturnMessage.errorUserNotFound;
      const status =
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
      this.logger.error(`${message}: ${status}`);
      throw new HttpException(`${message}: ${status}`, status);
    }
  }
}
