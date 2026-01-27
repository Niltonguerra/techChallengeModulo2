import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuardUser } from '@modules/auth/guards/jwt-auth-user.guard';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';

@ApiTags('question')
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) { }

  @Post('/create')
  @ApiBearerAuth('JWT-Auth')
  @UseGuards(JwtAuthGuardUser)
  @ApiOperation({ summary: 'Create a new question' })
  @ApiCreatedResponse({ type: ReturnMessageDTO })
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto);
  }

  @Get()
  @ApiBearerAuth('JWT-Auth')
  @UseGuards(JwtAuthGuardUser)
  @ApiOperation({ summary: 'List questions with filters' })
  findAll(
    @Req() req,
    @Query('subject') subject?: string,
    @Query('assignment') assignment?: 'UNASSIGNED' | 'MINE',
  ) {
    return this.questionService.findAll({
      user: req.user,
      subject,
      assignment,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionService.update(+id, updateQuestionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuardUser)
  @ApiBearerAuth('JWT-Auth')
  async remove(@Param('id') id: string, @Req() req) {
    return this.questionService.remove({
      questionId: id,
      user: req.user,
    });
  }
}
