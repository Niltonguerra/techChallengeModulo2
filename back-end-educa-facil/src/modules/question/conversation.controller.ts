import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuardUser } from '@modules/auth/guards/jwt-auth-user.guard';
import { GetTokenValues } from '@modules/auth/decorators/token.decorator';
import { JwtPayload } from '@modules/auth/dtos/JwtPayload.dto';

import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';

@ApiTags('conversation')
@ApiBearerAuth('JWT-Auth')
@UseGuards(JwtAuthGuardUser)
@Controller('question/:questionId/conversations')
export class ConversationController {
  constructor(private readonly service: ConversationService) {}

  @Get()
	@ApiOperation({ summary: 'List conversations/messages from a question' })
	list(
	@Param('questionId') questionId: string,
	@GetTokenValues() user: JwtPayload,
	) {
		return this.service.listByQuestion(questionId, user.id);
	}

  @Post()
  @ApiOperation({ summary: 'Send a message to a question conversation' })
  send(
    @Param('questionId') questionId: string,
    @Body() dto: CreateConversationDto,
    @GetTokenValues() user: JwtPayload,
  ) {
    return this.service.sendMessage(questionId, dto, user);
  }
}
