import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Conversation } from './entities/conversation.entity';
import { Question } from './entities/question.entity';

import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { ConversationGateway } from './conversation.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Question])],
  controllers: [ConversationController],
  providers: [ConversationService, ConversationGateway],
  exports: [ConversationService],
})
export class ConversationModule {}
