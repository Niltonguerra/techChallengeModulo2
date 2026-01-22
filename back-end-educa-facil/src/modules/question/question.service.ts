import { Injectable, NotFoundException } from '@nestjs/common';
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

  findAll() {
    return `This action returns all question`;
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    console.log(updateQuestionDto);
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
