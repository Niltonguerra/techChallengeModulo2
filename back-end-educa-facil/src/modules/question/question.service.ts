import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionService {
  create() {
    return 'This action adds a new question';
  }

  findAll() {
    return `This action returns all question`;
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  update(id: number) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
