import { Controller, Get, UseGuards } from '@nestjs/common';
import { QuestionViewService } from './question_view.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetTokenValues } from '@modules/auth/decorators/token.decorator';
import { JwtPayload } from '@modules/auth/dtos/JwtPayload.dto';
import { JwtAuthGuardUser } from '@modules/auth/guards/jwt-auth-user.guard';

@ApiTags('questionView')
@Controller('questionView')
export class QuestionViewController {
  constructor(private readonly questionViewService: QuestionViewService) {}

  @Get('notifications/unread')
  @ApiBearerAuth('JWT-Auth')
  @UseGuards(JwtAuthGuardUser)
  @ApiOperation({ summary: 'Verifica se existe atualização no chat de duvidas' })
  async unread(@GetTokenValues() user: JwtPayload) {
    console.log('user', user);
    return this.questionViewService.findUnread(user.id);
  }
}
