import { systemMessage } from '@config/i18n/pt/systemMessage';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SchoolSubjectService } from '../school_subject.service';
import { SchoolSubjectDropdownDto } from '../dto/get-shcool_subject.dto';

@Injectable()
export class GetSchoolSubjectCase {
  private readonly logger = new Logger(GetSchoolSubjectCase.name);
  constructor(private readonly schoolSubjectService: SchoolSubjectService) {}

  async getDropdownUseCase(): Promise<SchoolSubjectDropdownDto[]> {
    try {
      return await this.schoolSubjectService.getSubjectsForDropdown();
    } catch (error) {
      const message =
        error instanceof HttpException
          ? error.message
          : systemMessage.ReturnMessage.errorGetDropdown;
      const status =
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
      this.logger.error(`${message}: ${status}`);
      throw new HttpException(`${message}: ${status}`, status);
    }
  }

  async getAllDropdownUseCase(): Promise<SchoolSubjectDropdownDto[]> {
    try {
      return await this.schoolSubjectService.getAllSubjectsDropdown();
    } catch (error) {
      const message =
        error instanceof HttpException
          ? error.message
          : systemMessage.ReturnMessage.errorGetDropdown;
      const status =
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
      this.logger.error(`${message}: ${status}`);
      throw new HttpException(`${message}: ${status}`, status);
    }
  }
}
