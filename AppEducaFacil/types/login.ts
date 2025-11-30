import { UserPermissionEnum } from "./userPermissionEnum";

export interface ResponseAuthUser {
  token: string;
  user: {
    name: string;
    email: string;
    photo: string;
    id: string;
    permission: UserPermissionEnum;
  };
}

export interface RequestUser {
  email: string;
  password:string;
}