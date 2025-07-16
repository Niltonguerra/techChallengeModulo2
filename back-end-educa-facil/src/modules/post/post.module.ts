import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { CreatePostUseCase } from './usecases/createPost.usecase';
import { listPostUseCase } from './usecases/listPost.usecase';
import { Post } from './entities/post.entity';
import { AuthModule } from '@modules/auth/auth.module';
import { UpdatePostUseCase } from './usecases/updatePost.usecase';
import { GetPostUseCase } from './usecases/getPost.usecase';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), AuthModule, UserModule],
  providers: [PostService, CreatePostUseCase, UpdatePostUseCase, GetPostUseCase, listPostUseCase],
  controllers: [PostController],
})
export class PostModule {}
