import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ForgotPasswordService } from '../service/forgot-password.service';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';

@ApiTags('ForgotPassword')
@Controller('auth')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request a password reset via email.' })
  @ApiOkResponse({
    type: ReturnMessageDTO,
  })
  @ApiNotFoundResponse({
    description: 'Not found',
    type: ReturnMessageDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    type: ReturnMessageDTO,
  })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.forgotPasswordService.forgotPassword(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update password after clicking the link.' })
  @ApiOkResponse({
    type: ReturnMessageDTO,
  })
  @ApiBadRequestResponse({
    description: 'Invalid or expired token',
    type: ReturnMessageDTO,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: ReturnMessageDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    type: ReturnMessageDTO,
  })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.forgotPasswordService.resetPassword(dto);
  }
}
