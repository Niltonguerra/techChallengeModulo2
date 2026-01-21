import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolSubject } from './entities/school_subject.entity';
import { SchoolSubjectService } from './school_subject.service';
import { SchoolSubjectController } from './school_subject.controller';
import { AuthModule } from '@modules/auth/auth.module';
import { GetSchoolSubjectCase } from './usecases/getSchoolSubject.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([SchoolSubject]), AuthModule],
  controllers: [SchoolSubjectController],
  providers: [SchoolSubjectService, GetSchoolSubjectCase],
})
export class SchoolSubjectModule {}
