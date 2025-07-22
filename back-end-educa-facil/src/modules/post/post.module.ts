import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PostService } from './service/post.service';
import { PostController } from './controller/post.controller';
import { CreatePostUseCase } from './usecases/createPost.usecase';
import { Post } from './entities/post.entity';
import { AuthModule } from '@modules/auth/auth.module';
import { UpdatePostUseCase } from './usecases/updatePost.usecase';
import { GetPostUseCase } from './usecases/getPost.usecase';
import { UserModule } from '@modules/user/user.module';
import { User } from '@modules/user/entities/user.entity';
import { ListPostUseCase } from './usecases/listPost.usecase';
import { DeletePostUseCase } from './usecases/deletePost.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User]), AuthModule, UserModule],
  providers: [
    PostService,
    CreatePostUseCase,
    UpdatePostUseCase,
    GetPostUseCase,
    ListPostUseCase,
    DeletePostUseCase,
  ],
  controllers: [PostController],
})
export class PostModule {}
