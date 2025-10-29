import { Injectable } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserPermissionEnum } from '@modules/auth/Enum/permission.enum';
import { UserListDTO } from '../dtos/userList.dto';

@Injectable()
export class ListAllUsersUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(permission?: UserPermissionEnum): Promise<UserListDTO[]> {
    const users = await this.userService.findAll(permission);
    
    // Mapeando usuários para UserListDTO
    return users.map(user => {
      const userListDTO = new UserListDTO();
      userListDTO.id = user.id || ''; 
      userListDTO.email = user.email || ''; 
      userListDTO.name = user.name || '';
      userListDTO.permission = user.permission || ''; 
      return userListDTO;
    });
  }
}
