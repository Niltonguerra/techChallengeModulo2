import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { User } from '@modules/user/entities/user.entity';
import { SchoolSubject } from '@modules/school_subject/entities/school_subject.entity';
import { Conversation } from './entities/conversation.entity';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { QuestionView } from './entities/question_view.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Question, User, SchoolSubject, Conversation, QuestionView]),
    NotificationsModule,
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
