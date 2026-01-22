import { Injectable } from '@nestjs/common';
import { SchoolSubject } from './entities/school_subject.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SchoolSubjectDropdownDto } from './dto/get-shcool_subject.dto';

@Injectable()
export class SchoolSubjectService {
  constructor(
    @InjectRepository(SchoolSubject)
    private readonly schoolSubjectRepository: Repository<SchoolSubject>,
  ) {}

  async getSubjectsForDropdown(): Promise<SchoolSubjectDropdownDto[]> {
    return await this.schoolSubjectRepository
      .createQueryBuilder('subject')
      .innerJoin('subject.questions', 'question')
      .select(['DISTINCT ON (subject.id) subject.id AS value', 'subject.name AS label'])
      .orderBy('subject.id')
      .addOrderBy('LOWER(subject.name)', 'ASC')
      .getRawMany<SchoolSubjectDropdownDto>();
  }
}
