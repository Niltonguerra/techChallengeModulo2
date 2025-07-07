import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CreatePostUseCase } from './usecases/createUser.usecase';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FindOneUserUseCase } from './usecases/FindOneUser.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, CreatePostUseCase, FindOneUserUseCase],
  controllers: [UserController],
})
export class UserModule {}
