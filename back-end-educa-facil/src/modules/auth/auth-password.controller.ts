import { Body, Controller, Post } from '@nestjs/common';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { AuthPasswordService } from './auth-password.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth-password')
export class AuthPasswordController {
  constructor(private readonly authPasswordService: AuthPasswordService) {}

  @Post('forgot-password')
  @ApiOperation({ summary: 'Solicitar redefinição de senha via e-mail' })
  @ApiResponse({ status: 200, description: 'E-mail de recuperação enviado' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authPasswordService.forgotPassword(dto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Atualizar senha após clique no link' })
  @ApiResponse({ status: 200, description: 'Senha redefinida com sucesso' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authPasswordService.resetPassword(dto);
  }
}
