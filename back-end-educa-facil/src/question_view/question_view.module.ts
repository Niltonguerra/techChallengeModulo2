import { Module } from '@nestjs/common';
import { QuestionViewService } from './question_view.service';
import { QuestionViewController } from './question_view.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionView } from './entities/question_view.entity';
import { User } from '@modules/user/entities/user.entity';
import { Question } from '@modules/question/entities/question.entity';
import { Conversation } from '@modules/question/entities/conversation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, User, QuestionView, Conversation])],
  controllers: [QuestionViewController],
  providers: [QuestionViewService],
})
export class QuestionViewModule {}
