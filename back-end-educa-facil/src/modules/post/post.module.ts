import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { CreatePostUseCase } from './usecases/createPost.usecase';
import { Post } from './entities/post.entity';
import { GetPostUseCase } from './usecases/getPost.usecase';
import { UpdatePostUseCase } from './usecases/updatePost.usecase';
@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [PostService, CreatePostUseCase, UpdatePostUseCase, GetPostUseCase],
  controllers: [PostController],
})
export class PostModule {}
