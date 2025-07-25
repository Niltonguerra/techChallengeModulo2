import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { FindOneUserReturnMessageDTO } from '../dtos/returnMessageCRUD.dto';
import { LoginUsuarioInternoDTO } from '@modules/user/dtos/AuthUser.dto';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { IUser } from '../entities/interfaces/user.interface';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUpdateUser(createUserData: Partial<IUser>): Promise<ReturnMessageDTO> {
    const createUser: Partial<IUser> = {
      id: createUserData.id ?? uuidv4(),
      ...createUserData,
    };
    await this.userRepository.save(createUser);

    const returnService: ReturnMessageDTO = {
      message: systemMessage.ReturnMessage.sucessCreateUser,
      statusCode: 200,
    };
    return returnService;
  }

  async findOneUser(field: string, value: string): Promise<FindOneUserReturnMessageDTO> {
    const user = await this.userRepository.findOne({
      where: { [field]: value },
    });

    if (!user) {
      const returnMessage: FindOneUserReturnMessageDTO = {
        statusCode: 400,
        message: systemMessage.ReturnMessage.errorUserNotFound,
      };
      this.logger.log(`data not found with the field: ${field} and value: ${value}`);
      return returnMessage;
    }

    const returnMessage: FindOneUserReturnMessageDTO = {
      statusCode: 200,
      message: systemMessage.ReturnMessage.sucessFindOneUser,
      user: {
        id: user?.id,
        name: user?.name,
        photo: user?.photo,
        email: user?.email,
        social_midia: user?.social_midia ?? undefined,
        notification: user?.notification,
      },
    };
    return returnMessage;
  }

  async findOneUserLogin(value: string): Promise<LoginUsuarioInternoDTO | false> {
    const user = await this.userRepository.findOne({
      where: { email: value },
    });

    if (!user) {
      return false;
    }

    return {
      id: user.id,
      password: user.password,
      name: user.name,
      email: user.email,
      permission: user.permission,
      isActive: user.is_active,
    };
  }
}
