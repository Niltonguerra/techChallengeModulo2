import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { In, Repository } from 'typeorm';
import { User } from '@modules/user/entities/user.entity';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { SchoolSubject } from '@modules/school_subject/entities/school_subject.entity';
import { Conversation } from './entities/conversation.entity';
import { NotificationsGateway } from '@modules/notifications/notifications.gateway';
import { QuestionView } from './entities/question_view.entity';
import { NotificationDTO } from './dto/conversation.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SchoolSubject)
    private readonly schoolSubjectRepository: Repository<SchoolSubject>,
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(QuestionView)
    private questionViewRepository: Repository<QuestionView>,

    private notificationsGateway: NotificationsGateway,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<ReturnMessageDTO> {
    const user = await this.userRepository.findOne({
      where: { id: createQuestionDto.author_id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const subjects: SchoolSubject[] = await this.schoolSubjectRepository.findBy({
      id: In(createQuestionDto.tags),
    });

    const question = this.questionRepository.create({
      title: createQuestionDto.title,
      description: createQuestionDto.description,
      school_subjects: subjects,
      created_at: new Date().toISOString(),
      users: [user],
    });

    await this.questionRepository.save(question);

    return {
      message: 'Pergunta criada com sucesso!',
      statusCode: 201,
    };
  }

  async sendMessage(questionId: string, message: string, senderId: string) {
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
      relations: ['users'],
    });
    if (!question) throw new NotFoundException('Questão não encontrada');

    const senderUser = question.users.find((u) => u.id === senderId);
    if (!senderUser) throw new NotFoundException('Usuário não está vinculado a essa questão');

    // Cria a conversa
    const conversation = this.conversationRepository.create({
      question,
      user: senderUser,
      message,
      created_at: new Date().toISOString(),
    });
    await this.conversationRepository.save(conversation);

    // Notificar apenas quem ainda não viu a questão
    for (const recipientUser of question.users.filter((u) => u.id !== senderId)) {
      const view = await this.questionViewRepository.findOne({
        where: { user: recipientUser, question },
      });

      // Se não existe view, ou a última vez que viu foi antes da mensagem
      const shouldNotify = !view || new Date(conversation.created_at) > new Date(view.last_seen_at);
      if (shouldNotify) {
        this.notificationsGateway.notifyQuestionUpdate(recipientUser.id, {
          questionId: question.id,
          title: question.title,
          senderRole: senderUser.permission,
          senderName: senderUser.name,
          senderPhoto: senderUser.photo,
          senderId: senderUser.id,
        });
      }
    }

    return conversation;
  }

  /** Marca a questão como visualizada pelo usuário */
  async markQuestionAsViewed(userId: string, questionId: string) {
    // Busca as entidades User e Question
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const question = await this.questionRepository.findOne({ where: { id: questionId } });

    if (!user || !question) throw new Error('Usuário ou questão não encontrados');

    // Busca se já existe QuestionView
    let view = await this.questionViewRepository.findOne({
      where: { user: { id: user.id }, question: { id: question.id } },
    });

    if (view) {
      view.last_seen_at = new Date();
    } else {
      view = this.questionViewRepository.create({
        user,
        question,
        last_seen_at: new Date(),
      });
    }

    return await this.questionViewRepository.save(view);
  }

  async getNotificationsForUser(userId: string): Promise<NotificationDTO[]> {
    const views = await this.questionViewRepository.find({
      where: { user: { id: userId } },
      relations: ['question', 'question.users'],
    });

    const notifications: NotificationDTO[] = [];

    for (const view of views) {
      const question = view.question;
      for (const u of question.users) {
        if (u.id !== userId) {
          notifications.push({
            questionId: question.id,
            title: question.title,
            senderId: u.id,
            senderName: u.name,
            senderPhoto: u.photo,
            read: view.last_seen_at && view.last_seen_at >= question.updated_at ? true : false,
          });
        }
      }
    }

    return notifications;
  }
}
