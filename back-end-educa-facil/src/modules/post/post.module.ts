import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { CreatePostUseCase } from './usecases/createPost.usecase';
import { Post } from './entities/post.entity';
<<<<<<< HEAD
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), AuthModule],
  providers: [PostService, CreatePostUseCase],
=======
import { GetPostUseCase } from './usecases/getPost.usecase';
import { UpdatePostUseCase } from './usecases/updatePost.usecase';
@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [PostService, createPostUseCase, UpdatePostUseCase, GetPostUseCase],
>>>>>>> origin/main
  controllers: [PostController],
})
export class PostModule {}
