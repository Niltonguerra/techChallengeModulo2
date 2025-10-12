export interface ResponseAuthUser {
  token: string;
  user: {
    name: string;
    email: string;
    photo: string;
    id: string;
    permission: 'admin' | 'user';
  };
}

export interface RequestUser {
  email: string;
  password:string;
}