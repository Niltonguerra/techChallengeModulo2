import { PartialType } from '@nestjs/swagger';
import { CreateUserDTO } from './createUser.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDTO extends PartialType(CreateUserDTO) {
  @ApiPropertyOptional()
  id?: string;
}
