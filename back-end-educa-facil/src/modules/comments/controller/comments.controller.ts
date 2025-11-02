import { JwtAuthGuardUser } from '@modules/auth/guards/jwt-auth-user.guard';
import { RolesGuardProfessor } from '@modules/auth/guards/roles-professor.guard';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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
}
