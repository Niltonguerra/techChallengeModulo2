import { AuthModule } from '@modules/auth/auth.module';
import { User } from '@modules/user/entities/user.entity';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './controller/post.controller';
import { Post } from './entities/post.entity';
import { PostService } from './service/post.service';
import { CreatePostUseCase } from './usecases/createPost.usecase';
import { DeletePostUseCase } from './usecases/deletePost.usecase';
import { GetPostUseCase } from './usecases/getPost.usecase';
import { GetUniqueHashtagsUseCase } from './usecases/getUniqueHashtags.usecase';
import { ListPostUseCase } from './usecases/listPost.usecase';
import { UpdatePostUseCase } from './usecases/updatePost.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User]), AuthModule, UserModule],
  providers: [
    PostService,
    CreatePostUseCase,
    UpdatePostUseCase,
    GetPostUseCase,
    ListPostUseCase,
    DeletePostUseCase,
    GetUniqueHashtagsUseCase,
  ],
  controllers: [PostController],
})
export class PostModule { }
