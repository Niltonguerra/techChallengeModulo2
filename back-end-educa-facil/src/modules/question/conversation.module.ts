import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Conversation } from './entities/conversation.entity';
import { Question } from './entities/question.entity';

import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { ConversationGateway } from './conversation.gateway';
import { QuestionService } from './question.service';
import { User } from '@modules/user/entities/user.entity';
import { SchoolSubject } from '@modules/school_subject/entities/school_subject.entity';
import { NotificationGateway } from './notification.gateway';
import { QuestionView } from 'question_view/entities/question_view.entity';
import { QuestionViewService } from 'question_view/question_view.service';
@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Question, QuestionView, User, SchoolSubject])],
  controllers: [ConversationController],
  providers: [
    ConversationService,
    ConversationGateway,
    QuestionService,
    NotificationGateway,
    QuestionViewService,
  ],
  exports: [ConversationService],
})
export class ConversationModule {}
