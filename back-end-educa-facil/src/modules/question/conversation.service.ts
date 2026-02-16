import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Conversation } from './entities/conversation.entity';
import { Question } from './entities/question.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { JwtPayload } from '@modules/auth/dtos/JwtPayload.dto';
import { ConversationGateway } from './conversation.gateway';
import { GetConversationDto } from './dto/get-conversations-response.dto';
import { User } from '@modules/user/entities/user.entity';
import { NotificationGateway } from './notification.gateway';
import { QuestionViewService } from 'question_view/question_view.service';
@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation) private readonly conversationRepo: Repository<Conversation>,
    @InjectRepository(Question) private readonly questionRepo: Repository<Question>,
    private readonly gateway: ConversationGateway,
    private readonly notificationGateway: NotificationGateway,
    private readonly questionViewService: QuestionViewService,
  ) {}

  async listByQuestion(questionId: string, requesterId: string): Promise<GetConversationDto[]> {
    const question = await this.questionRepo.findOne({ where: { id: questionId } });
    if (!question) throw new NotFoundException('Pergunta não encontrada');

    return this.conversationRepo
      .createQueryBuilder('c')
      .leftJoin('c.question', 'q')
      .leftJoin(User, 'u', 'u.id = c.id_user::uuid')
      .where('q.id = :questionId::uuid', { questionId })
      .orderBy('c.created_at', 'ASC')
      .select([
        'c.message AS "content"',
        'u.name AS "authorName"',
        '(c.id_user = :requesterId) AS "isUserTheAuthor"',
        'c.created_at AS "createdAt"',
      ])
      .setParameter('requesterId', requesterId)
      .getRawMany<GetConversationDto>();
  }

  async sendMessage(questionId: string, dto: CreateConversationDto, user: JwtPayload) {
    const question = await this.questionRepo.findOne({
      where: { id: questionId },
      relations: ['users', 'admin'],
    });

    if (!question) throw new NotFoundException('Pergunta não encontrada');

    const isParticipant = (question.users || []).some((u) => u.id === user.id);
    const isAdminAssigned = question.admin?.id === user.id;

    if (!isParticipant && !isAdminAssigned) {
      throw new ForbiddenException('Você não participa desta conversa.');
    }

    const entity = this.conversationRepo.create({
      id_user: user.id,
      message: dto.message,
      question,
      created_at: new Date().toISOString(),
    });

    const saved = await this.conversationRepo.save(entity);

    this.gateway.notifyNewMessages(questionId, {
      id: saved.id,
      message: saved.message,
      createdAt: saved.created_at,
      userId: saved.id_user,
    });

    const recipients = [...(question.users || []), question.admin].filter(
      (u) => u && u.id !== user.id, // nunca notifica quem enviou
    );
    for (const recipient of recipients) {
      const isViewing = this.gateway.isUserViewing(questionId, recipient.id);

      if (await isViewing) {
        continue;
      }

      const view = await this.questionViewService.getLastSeen(questionId, recipient.id);

      const messageDate =
        saved.created_at instanceof Date ? saved.created_at : new Date(saved.created_at);

      const shouldNotify = !view || view.last_seen_at < messageDate;

      if (shouldNotify) {
        this.notificationGateway.notifyUser(recipient.id, {
          type: 'NEW_MESSAGE',
          questionId,
          message: dto.message,
          questionTitle: question.title,
        });
      }
    }

    return saved;
  }
}
