import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { In, Repository } from 'typeorm';
import { User } from '@modules/user/entities/user.entity';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { SchoolSubject } from '@modules/school_subject/entities/school_subject.entity';

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

findAll(params: {
  user: any;
  subject?: string;
  assignment?: 'UNASSIGNED' | 'MINE';
}) {
  const { user, subject, assignment } = params;

  const qb = this.questionRepository
    .createQueryBuilder('question')
    .leftJoinAndSelect('question.users', 'users')
    .leftJoinAndSelect('question.school_subjects', 'subjects')
    .leftJoinAndSelect('question.conversation', 'conversation')
    .orderBy('question.created_at', 'DESC');

  if (subject) {
    qb.andWhere('subjects.id = :subject', { subject });
  }

  if (user.permission === 'student') {
    qb.andWhere('users.id = :userId', { userId: user.id });
    return qb.getMany();
  }

  if (assignment === 'MINE') {
    qb.andWhere('users.id = :userId', { userId: user.id });
  }

  if (assignment === 'UNASSIGNED') {
    qb.andWhere('users.id IS NULL');
  }

  return qb.getMany();
}



  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    console.log(updateQuestionDto);
    return `This action updates a #${id} question`;
  }

  async remove({ questionId, user }) {
  const question = await this.questionRepository.findOne({
    where: { id: questionId },
    relations: { users: true },
  });

  if (!question) {
    throw new NotFoundException('Dúvida não encontrada');
  }

  if (user.permission === 'student') {
    const isOwner = question.users.some((u) => u.id === user.id);

    if (!isOwner) {
      throw new ForbiddenException(
        'Você não tem permissão para excluir esta dúvida',
      );
    }
  }

  await this.questionRepository.remove(question);

  return { message: 'Dúvida removida com sucesso' };
}

}
