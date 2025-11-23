import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import {
  FindOneUserReturnMessageDTO,
  ListUserReturnMessageDTO,
} from '../dtos/returnMessageCRUD.dto';
import { LoginUsuarioInternoDTO } from '@modules/user/dtos/AuthUser.dto';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { UserPermissionEnum } from '@modules/auth/Enum/permission.enum';
import { IUser } from '../interfaces/user.interface';
import { UserStatusEnum } from '../enum/status.enum';
import { searchByFieldUserEnum } from '../enum/searchByFieldUser.enum';

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

  async findOneUser(
    field: searchByFieldUserEnum,
    value: string,
    isActive?: UserStatusEnum,
  ): Promise<FindOneUserReturnMessageDTO> {
    const where: Record<string, string> = { [field]: value };

    if (isActive) {
      where.is_active = isActive;
    }

    const user = await this.userRepository.findOne({ where });

    if (!user) {
      const returnMessage: FindOneUserReturnMessageDTO = {
        statusCode: 400,
        message: systemMessage.ReturnMessage.errorUserNotFound,
      };
      this.logger.debug(`data not found with the field: ${field} and value: ${value}`);
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
      },
    };
    return returnMessage;
  }

  async findOneUserLogin(value: string): Promise<LoginUsuarioInternoDTO | false> {
    const user = await this.userRepository.findOne({
      where: { email: value, is_active: UserStatusEnum.ACTIVE },
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
      photo: user.photo,
    };
  }

  async listAuthors(field: string, value: string): Promise<ListUserReturnMessageDTO> {
    const qb = this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.posts', 'post')
      .select(['user.id', 'user.name'])
      .distinct(true)
      .orderBy('user.name', 'ASC')
      .take(20);

    qb.andWhere('user.permission = :perm', { perm: UserPermissionEnum.ADMIN });
    qb.andWhere('user.is_active = :is_active', { is_active: UserStatusEnum.ACTIVE });
    if (field && value) {
      qb.andWhere(`user.${field} = :value`, { value });
    }

    const users = await qb.getMany();

    return {
      statusCode: 200,
      message: systemMessage.ReturnMessage.successListUsers,
      data: users,
    };
  }

  async findAll(permission?: UserPermissionEnum): Promise<Partial<User>[]> {
    const options: FindManyOptions<User> = {
      select: ['id', 'name', 'email', 'permission', 'photo', 'is_active'],
      where: {
        is_active: UserStatusEnum.ACTIVE,
        ...(permission ? { permission } : {}),
      },
    };
    return this.userRepository.find(options);
  }
}
