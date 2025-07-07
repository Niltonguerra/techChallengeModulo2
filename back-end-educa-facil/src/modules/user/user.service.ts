import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDTO } from './DTOs/createUser.dto';
import { CreateReturnMessageDTO } from '@modules/post/DTOs/returnMessage.DTO';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { FindOneUserReturnMessageDTO } from './DTOs/returnMessage.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserData: CreateUserDTO): Promise<CreateReturnMessageDTO> {
    const user = this.userRepository.create({ id: uuidv4(), ...createUserData });

    await this.userRepository.save(user);
    const returnService: CreateReturnMessageDTO = {
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
      throw new Error(systemMessage.ReturnMessage.errorUserNotFound);
    }

    const returnMessage: FindOneUserReturnMessageDTO = {
      statusCode: 200,
      message: systemMessage.ReturnMessage.sucessGetPostById,
      user: {
        name: user.name,
        photo: user.photo,
        email: user.email,
        social_midia: user.social_midia,
        notification: user.notification,
      },
    };
    return returnMessage;
  }
}
