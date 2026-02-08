import { Question } from '@modules/question/entities/question.entity';
import { User } from '@modules/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionView } from './entities/question_view.entity';
import { Conversation } from '@modules/question/entities/conversation.entity';

@Injectable()
export class QuestionViewService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(QuestionView)
    private questionViewRepository: Repository<QuestionView>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) {}

  async markAsViewed(questionId: string, userId: string) {
    await this.questionViewRepository.upsert(
      {
        user: { id: userId },
        question: { id: questionId },
        last_seen_at: new Date(),
      },
      {
        conflictPaths: ['user', 'question'],
      },
    );
  }

  async getLastSeen(questionId: string, userId: string) {
    return await this.questionViewRepository.findOne({
      where: {
        question: { id: questionId },
        user: { id: userId },
      },
    });
  }

  async findUnread(userId: string) {
    return this.conversationRepository
      .createQueryBuilder('c')
      .innerJoin('c.question', 'q')
      .leftJoin('question_view', 'qv', 'qv.question_id = q.id AND qv.user_id = :userId', { userId })
      .where('c.id_user != :userId', { userId })
      .andWhere(`qv.id IS NULL OR c.created_at > qv.last_seen_at`)
      .distinctOn(['q.id'])
      .select([
        'q.id AS "questionId"',
        'q.title AS "questionTitle"',
        'c.message AS "message"',
        'c.created_at AS "createdAt"',
      ])
      .orderBy('q.id', 'ASC')
      .addOrderBy('c.created_at', 'DESC')
      .getRawMany();
  }
}
