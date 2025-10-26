import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserReadController } from './controllers/userRead.controller';
import { CreateUserUseCase } from './usecases/createUser.usecase';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FindOneUserUseCase } from './usecases/FindOneUser.usecase';
import { AuthController } from './controllers/SignIn.controller';
import { SignInUseCase } from './usecases/SignIn.usecase';
import { AuthModule } from '@modules/auth/auth.module';
import { EmailModule } from '@modules/email/email.module';
import { Post } from '@modules/post/entities/post.entity';
import { listAuthorsUseCase } from './usecases/listAuthors.usecase';
import { ListAllUsersUseCase } from './usecases/listAllUsers.usecase';
import { UserDeleteService } from './service/userDelete.service';
import { UserWriteController } from './controllers/UserWrite.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User]), AuthModule, EmailModule],
  providers: [
    UserService,
    CreateUserUseCase,
    FindOneUserUseCase,
    SignInUseCase,
    listAuthorsUseCase,
    ListAllUsersUseCase,
    UserDeleteService,
  ],
  controllers: [UserReadController, AuthController, UserWriteController],
  exports: [UserService, ListAllUsersUseCase],
})
export class UserModule {}
