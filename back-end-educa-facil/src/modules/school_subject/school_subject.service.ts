import { Injectable } from '@nestjs/common';

@Injectable()
export class SchoolSubjectService {
  create() {
    return 'This action adds a new schoolSubject';
  }

  findAll() {
    return `This action returns all schoolSubject`;
  }

  findOne(id: number) {
    return `This action returns a #${id} schoolSubject`;
  }

  update(id: number) {
    return `This action updates a #${id} schoolSubject`;
  }

  remove(id: number) {
    return `This action removes a #${id} schoolSubject`;
  }
}
