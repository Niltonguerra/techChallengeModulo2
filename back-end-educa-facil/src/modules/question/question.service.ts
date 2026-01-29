import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { QuestionStatus } from './enum/question-status.enum';
import { In, Repository } from 'typeorm';
import { User } from '@modules/user/entities/user.entity';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { SchoolSubject } from '@modules/school_subject/entities/school_subject.entity';
import { UserPermissionEnum } from '@modules/auth/Enum/permission.enum';
import { JwtPayload } from '@modules/auth/dtos/JwtPayload.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SchoolSubject)
    private readonly schoolSubjectRepository: Repository<SchoolSubject>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<ReturnMessageDTO> {
    const user = await this.userRepository.findOne({
      where: { id: createQuestionDto.author_id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    let subjects: SchoolSubject[] = [];
    if (createQuestionDto.tags && createQuestionDto.tags.length > 0) {
      subjects = await this.schoolSubjectRepository.findBy({
        id: In(createQuestionDto.tags),
      });
    }

    const question = this.questionRepository.create({
      title: createQuestionDto.title,
      description: createQuestionDto.description,
      school_subjects: subjects,
      created_at: new Date().toISOString(),
      status: QuestionStatus.OPEN,
      users: [user],
    });

    await this.questionRepository.save(question);

    return {
      message: 'Pergunta criada com sucesso!',
      statusCode: 201,
    };
  }

  findAll(params: { user: JwtPayload; subject?: string; assignment?: 'UNASSIGNED' | 'MINE' }) {
    const { user, subject, assignment } = params;

    const qb = this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.users', 'users')
      .leftJoinAndSelect('question.school_subjects', 'subjects')
      .leftJoinAndSelect('question.conversations', 'conversations')
      .leftJoinAndSelect('question.admin', 'admin')
      .orderBy('question.created_at', 'DESC');

    if (subject) {
      qb.andWhere('subjects.id = :subject', { subject });
    }

    if (user.permission === UserPermissionEnum.USER) {
      qb.andWhere('users.id = :userId', { userId: user.id });
      return qb.getMany();
    }

    if (assignment === 'MINE') {
      qb.andWhere('admin.id = :userId', { userId: user.id });
    }

    if (assignment === 'UNASSIGNED') {
      qb.andWhere('admin.id IS NULL');
    }

    return qb.getMany();
  }

  async assignToAdmin(questionId: string, adminId: string): Promise<ReturnMessageDTO> {
    const adminUser = await this.userRepository.findOne({
      where: { id: adminId },
    });

    if (!adminUser) throw new NotFoundException('Usuário não encontrado.');

    if (adminUser.permission !== UserPermissionEnum.ADMIN) {
      throw new ForbiddenException('Apenas Professores podem atender dúvidas.');
    }

    const question = await this.questionRepository.findOne({
      where: { id: questionId },
      relations: ['users', 'admin'],
    });

    if (!question) throw new NotFoundException('Pergunta não encontrada');

    if (question.status === QuestionStatus.CLOSED) {
      throw new BadRequestException('Esta dúvida já foi finalizada e não pode ser assumida.');
    }

    if (question.admin) {
      throw new BadRequestException('Esta dúvida já está sob responsabilidade de outro professor.');
    }

    question.admin = adminUser;

    const isAlreadyParticipant = question.users.some((u) => u.id === adminUser.id);
    if (!isAlreadyParticipant) {
      question.users.push(adminUser);
    }

    await this.questionRepository.save(question);

    return { message: 'Dúvida atribuída com sucesso!', statusCode: 200 };
  }

  async closeQuestion(questionId: string, user: JwtPayload): Promise<ReturnMessageDTO> {
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
      relations: ['users', 'admin'],
    });

    if (!question) throw new NotFoundException('Pergunta não encontrada');

    if (question.status === QuestionStatus.CLOSED) {
      throw new BadRequestException('A dúvida já está fechada.');
    }

    const isAdmin = user.permission === 'ADMIN';

    if (!isAdmin) {
      const isAuthor = question.users?.some((u) => u.id === user.id);

      if (!isAuthor) {
        throw new ForbiddenException('Você não tem permissão para encerrar esta dúvida.');
      }
    }

    question.status = QuestionStatus.CLOSED;
    await this.questionRepository.save(question);

    return { message: 'Dúvida finalizada com sucesso!', statusCode: 200 };
  }

  async findOne(id: string) {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['school_subjects', 'users', 'admin'],
    });
    if (!question) {
      throw new NotFoundException(`Pergunta com ID ${id} não encontrada.`);
    }
    return question;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    console.log(updateQuestionDto);
    return `This action updates a #${id} question`;
  }

  async remove({
    questionId,
    user,
  }: {
    questionId: string;
    user: JwtPayload;
  }): Promise<ReturnMessageDTO> {
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
      relations: { users: true },
    });

    if (!question) {
      throw new NotFoundException('Dúvida não encontrada');
    }

    const isStudent = user.permission === 'USER';

    if (isStudent) {
      const isOwner = Array.isArray(question.users) && question.users.some((u) => u.id === user.id);

      if (!isOwner) {
        throw new ForbiddenException('Você não tem permissão para excluir esta dúvida');
      }
    }

    await this.questionRepository.remove(question);

    return {
      message: 'Dúvida removida com sucesso',
      statusCode: 200,
    };
  }
}
