import { Module } from '@nestjs/common';
import { SchoolSubjectService } from './school_subject.service';
import { SchoolSubjectController } from './school_subject.controller';

@Module({
  controllers: [SchoolSubjectController],
  providers: [SchoolSubjectService],
})
export class SchoolSubjectModule {}
