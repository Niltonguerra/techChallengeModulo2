import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { createPostUseCase } from './usecases/createPost.usecase';
import { Post } from './entities/post.entity';
import { DeletePostUseCase } from './usecases/deletePost.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [PostService, createPostUseCase, DeletePostUseCase],
  controllers: [PostController],
})
export class PostModule {}
