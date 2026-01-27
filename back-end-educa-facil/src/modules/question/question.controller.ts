import { Controller, Post, Body, UseGuards, Param, Get } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';

import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuardUser } from '@modules/auth/guards/jwt-auth-user.guard';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { GetTokenValues } from '@modules/auth/decorators/token.decorator';
import { JwtPayload } from '@modules/auth/dtos/JwtPayload.dto';
import { SendMessageDto } from './dto/conversation.dto';

@ApiTags('question')
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('/create')
  @ApiBearerAuth('JWT-Auth')
  @UseGuards(JwtAuthGuardUser)
  @ApiOperation({ summary: 'Create a new question' })
  @ApiCreatedResponse({ type: ReturnMessageDTO })
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto);
  }

  @Post(':id/messages')
  @ApiBearerAuth('JWT-Auth')
  @UseGuards(JwtAuthGuardUser)
  @ApiOperation({ summary: 'Cria bate papo' })
  async sendMessage(
    @Param('id') questionId: string,
    @Body() dto: SendMessageDto,
    @GetTokenValues() rawToken: JwtPayload,
  ) {
    const senderId = rawToken.id;
    return this.questionService.sendMessage(questionId, dto.message, senderId);
  }

  @ApiBearerAuth('JWT-Auth')
  @UseGuards(JwtAuthGuardUser)
  @ApiOperation({ summary: 'marcar questão como visualizada' })
  @Post(':questionId/view')
  async markAsViewed(
    @Param('questionId') questionId: string,
    @GetTokenValues() rawToken: JwtPayload,
  ) {
    const userId = rawToken.id;
    await this.questionService.markQuestionAsViewed(userId, questionId);
    return { message: 'Questão marcada como visualizada' };
  }

  @ApiBearerAuth('JWT-Auth')
  @UseGuards(JwtAuthGuardUser)
  @ApiOperation({ summary: 'Retorna se possui atualizacao no chat' })
  @Get('notifications')
  getNotifications(@GetTokenValues() rawToken: JwtPayload) {
    const userId = rawToken.id;
    return this.questionService.getNotificationsForUser(userId);
  }
}
