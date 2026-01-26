import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuardUser } from '@modules/auth/guards/jwt-auth-user.guard';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { JwtPayload } from '@modules/auth/dtos/JwtPayload.dto';
import { GetTokenValues } from '@modules/auth/decorators/token.decorator';

@ApiTags('question')
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('/create')
  @ApiBearerAuth('JWT-Auth')
  @UseGuards(JwtAuthGuardUser)
  @ApiOperation({ summary: 'Create a new question' })
  @ApiCreatedResponse({ type: ReturnMessageDTO })
  create(@Body() createQuestionDto: CreateQuestionDto, @GetTokenValues() user: JwtPayload) {
    createQuestionDto.author_id = user.id;
    return this.questionService.create(createQuestionDto);
  }

  @Patch(':id/assign')
  @ApiBearerAuth('JWT-Auth')
  @UseGuards(JwtAuthGuardUser)
  @ApiOperation({ summary: 'Teacher takes on the doubt' })
  @ApiOkResponse({ type: ReturnMessageDTO })
  assignAdmin(@Param('id') id: string, @GetTokenValues() user: JwtPayload) {
    return this.questionService.assignToAdmin(id, user.id);
  }

  @Patch(':id/close')
  @ApiBearerAuth('JWT-Auth')
  @UseGuards(JwtAuthGuardUser)
  @ApiOperation({ summary: 'Teacher or student resolves the question.' })
  @ApiOkResponse({ type: ReturnMessageDTO })
  closeQuestion(@Param('id') id: string, @GetTokenValues() user: JwtPayload) {
    return this.questionService.closeQuestion(id, user);
  }

  @Get()
  findAll() {
    return this.questionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionService.update(+id, updateQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionService.remove(+id);
  }
}
