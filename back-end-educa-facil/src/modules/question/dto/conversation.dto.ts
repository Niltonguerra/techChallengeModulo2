import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendMessageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class NotificationDTO {
  questionId: string;
  title: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  read: boolean;
}
