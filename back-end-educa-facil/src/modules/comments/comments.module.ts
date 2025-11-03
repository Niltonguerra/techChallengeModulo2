import { AuthModule } from '@modules/auth/auth.module';
import { Post } from '@modules/post/entities/post.entity';
import { User } from '@modules/user/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsController } from './controller/comments.controller';
import { Comments } from './entities/comment.entity';
import { CommentsService } from './service/comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comments, User, Post]), AuthModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
