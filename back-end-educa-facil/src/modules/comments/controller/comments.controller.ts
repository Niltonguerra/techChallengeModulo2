import { GetTokenValues } from '@modules/auth/decorators/token.decorator';
import { JwtPayload } from '@modules/auth/dtos/JwtPayload.dto';
import { JwtAuthGuardUser } from '@modules/auth/guards/jwt-auth-user.guard';
import { RolesGuardProfessor } from '@modules/auth/guards/roles-professor.guard';
import { RolesGuardStudent } from '@modules/auth/guards/roles-student.guard';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateCommentDTO } from '../dto/create-comment.dto';
import { CommentsService } from '../service/comments.service';

@ApiUnauthorizedResponse({ description: 'Unauthorized', type: ReturnMessageDTO })
@ApiNotFoundResponse({ description: 'Not found', type: ReturnMessageDTO })
@ApiForbiddenResponse({ description: 'Forbidden', type: ReturnMessageDTO })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ReturnMessageDTO })
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Delete(':id')
  @ApiBearerAuth('JWT-Auth')
  @UseGuards(JwtAuthGuardUser, RolesGuardProfessor)
  @ApiOperation({ summary: 'Delete comment by ID of teacher' })
  @ApiOkResponse({ type: ReturnMessageDTO })
  remove(@Param('id') id: string) {
    return this.commentsService.delete(id);
  }

  @Post()
  @ApiBearerAuth('JWT-Auth')
  @UseGuards(JwtAuthGuardUser, RolesGuardStudent)
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiOkResponse({ type: ReturnMessageDTO })
  async create(@Body() dto: CreateCommentDTO, @GetTokenValues() rawToken: JwtPayload) {
    const userId = rawToken.id;
    const result = await this.commentsService.create(dto, userId);
    return result;
  }
}
