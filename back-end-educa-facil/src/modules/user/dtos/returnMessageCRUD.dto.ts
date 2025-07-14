export class FindOneUserReturnMessageDTO {
  statusCode: number;
  message: string;
  user: {
    id: string;
    name: string;
    photo: string;
    email: string;
    social_midia: Record<string, string>;
    notification: boolean;
  };
}
