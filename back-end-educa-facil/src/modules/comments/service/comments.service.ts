import { systemMessage } from '@config/i18n/pt/systemMessage';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Comments } from '../entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private readonly repository: Repository<Comments>,
  ) { }

  async delete(id: string): Promise<ReturnMessageDTO> {
    const comment = await this.repository.findOne({ where: { id: id } });
    if (!comment) {
      return {
        statusCode: 404,
        message: systemMessage.ReturnMessage.errorCommentNotFound,
      };
    }
    await this.repository.remove(comment);
    return {
      statusCode: 200,
      message: systemMessage.ReturnMessage.successDeleteComment,
    };
  }
}
