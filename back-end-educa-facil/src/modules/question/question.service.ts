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

    const isAdmin = (user.permission as UserPermissionEnum) === UserPermissionEnum.ADMIN;

    const usersList = question.users || [];
    const isAuthor = usersList.some((u) => u.id === user.id);

    if (!isAdmin && !isAuthor) {
      throw new ForbiddenException('Você não tem permissão para encerrar esta dúvida.');
    }

    question.status = QuestionStatus.CLOSED;
    await this.questionRepository.save(question);

    return { message: 'Dúvida finalizada com sucesso!', statusCode: 200 };
  }
  async findAll() {
    return await this.questionRepository.find({
      order: { created_at: 'DESC' },
      relations: ['school_subjects', 'users', 'admin'],
    });
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

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
