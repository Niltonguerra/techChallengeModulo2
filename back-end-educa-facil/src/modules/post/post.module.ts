import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { CreatePostUseCase } from './usecases/createPost.usecase';
import { Post } from './entities/post.entity';
import { AuthModule } from '@modules/auth/auth.module';
import { UpdatePostUseCase } from './usecases/updatePost.usecase';
import { GetPostUseCase } from './usecases/getPost.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), AuthModule],
  providers: [PostService, CreatePostUseCase, UpdatePostUseCase, GetPostUseCase],
  controllers: [PostController],
})
export class PostModule {}
