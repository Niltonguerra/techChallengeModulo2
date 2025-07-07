export class CreateReturnMessageDTO {
  statusCode: number;
  message: string;
}

export class FindOneUserReturnMessageDTO {
  statusCode: number;
  message: string;
  user: {
    name: string;
    photo: string;
    email: string;
    social_midia: Record<string, string>;
    notification: boolean;
  };
}
