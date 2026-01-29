import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { User } from '@modules/user/entities/user.entity';
import { SchoolSubject } from '@modules/school_subject/entities/school_subject.entity';
import { ConversationModule } from './conversation.module';

@Module({
  imports: [TypeOrmModule.forFeature([Question, User, SchoolSubject]), ConversationModule],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
