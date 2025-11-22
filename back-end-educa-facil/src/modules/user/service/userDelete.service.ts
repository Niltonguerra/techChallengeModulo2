import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { UserStatusEnum } from '../enum/status.enum';

@Injectable()
export class UserDeleteService {
  private readonly logger = new Logger(UserDeleteService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async deleteUser(idUser: string): Promise<ReturnMessageDTO> {
    const user = await this.userRepository.findOne({ where: { id: idUser } });
    if (!user) {
      return {
        statusCode: 404,
        message: systemMessage.ReturnMessage.errorUserNotFound,
      };
    }
    await this.userRepository.update(
      { id: idUser },
      {
        is_active: UserStatusEnum.INACTIVE,
        updated_at: new Date(),
      },
    );

    return {
      statusCode: 200,
      message: systemMessage.ReturnMessage.successDeleteUser,
    };
  }
}
