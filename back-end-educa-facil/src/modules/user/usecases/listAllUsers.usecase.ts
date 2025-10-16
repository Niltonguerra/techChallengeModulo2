import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserService } from '../service/user.service';
import { UserPermissionEnum } from '@modules/auth/Enum/permission.enum';

@Injectable()
export class ListAllUsersUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(permission?: UserPermissionEnum): Promise<Partial<User>[]> {
    return this.userService.findAll(permission);
  }
}
