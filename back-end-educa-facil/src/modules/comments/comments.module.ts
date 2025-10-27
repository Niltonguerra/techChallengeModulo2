import { AuthModule } from '@modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsController } from './controller/comments.controller';
import { Comments } from './entities/comment.entity';
import { CommentsService } from './service/comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comments]), AuthModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule { }
