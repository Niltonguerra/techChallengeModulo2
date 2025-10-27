import { ApiProperty } from '@nestjs/swagger';

export class UserSummaryDTO {

    @ApiProperty()
    name: string;

    @ApiProperty()
    photo: string;
}

export class ListComment {
    @ApiProperty()
    id: string;

    @ApiProperty()
    content: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    user: UserSummaryDTO;
}