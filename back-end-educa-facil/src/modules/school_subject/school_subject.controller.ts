import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { JwtAuthGuardUser } from '@modules/auth/guards/jwt-auth-user.guard';
import { RolesGuardStudent } from '@modules/auth/guards/roles-student.guard';
import { SchoolSubjectDropdownDto } from './dto/get-shcool_subject.dto';
import { GetSchoolSubjectCase } from './usecases/getSchoolSubject.usecase';

@ApiUnauthorizedResponse({ description: 'Unauthorized', type: ReturnMessageDTO })
@ApiNotFoundResponse({ description: 'Not found', type: ReturnMessageDTO })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ReturnMessageDTO })
@Controller('school-subject')
export class SchoolSubjectController {
  constructor(private readonly getSchoolSubjectCase: GetSchoolSubjectCase) {}

  @Get('/dropdown')
  @ApiBearerAuth('JWT-Auth')
  @UseGuards(JwtAuthGuardUser, RolesGuardStudent)
  @ApiOperation({ summary: 'Lista de matérias associadas a dúvidas' })
  @ApiOkResponse({ type: SchoolSubjectDropdownDto, isArray: true })
  async getDropdown(): Promise<SchoolSubjectDropdownDto[]> {
    return await this.getSchoolSubjectCase.getDropdownUseCase();
  }
}
