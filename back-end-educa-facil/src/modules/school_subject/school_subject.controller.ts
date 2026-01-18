import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SchoolSubjectService } from './school_subject.service';
import { CreateSchoolSubjectDto } from './dto/create-school_subject.dto';
import { UpdateSchoolSubjectDto } from './dto/update-school_subject.dto';

@Controller('school-subject')
export class SchoolSubjectController {
  constructor(private readonly schoolSubjectService: SchoolSubjectService) {}

  @Post()
  create(@Body() createSchoolSubjectDto: CreateSchoolSubjectDto) {
    return this.schoolSubjectService.create(createSchoolSubjectDto);
  }

  @Get()
  findAll() {
    return this.schoolSubjectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schoolSubjectService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSchoolSubjectDto: UpdateSchoolSubjectDto) {
    return this.schoolSubjectService.update(+id, updateSchoolSubjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schoolSubjectService.remove(+id);
  }
}
