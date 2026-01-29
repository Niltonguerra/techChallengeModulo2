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
      .select(['subject.id AS value', 'subject.name AS label'])
      .distinctOn(['subject.id'])
      .orderBy('subject.id', 'ASC')
      .addOrderBy('LOWER(subject.name)', 'ASC')
      .getRawMany<SchoolSubjectDropdownDto>();
  }

  async getAllSubjectsDropdown(): Promise<SchoolSubjectDropdownDto[]> {
    return await this.schoolSubjectRepository
      .createQueryBuilder('subject')
      .select(['subject.id AS value', 'subject.name AS label'])
      .orderBy('LOWER(subject.name)', 'ASC')
      .getRawMany<SchoolSubjectDropdownDto>();
  }
}
