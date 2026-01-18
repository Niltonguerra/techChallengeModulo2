import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@modules/user/entities/user.entity';
import { Conversation } from '@modules/question/entities/conversation.entity';

@Entity({
  name: 'school_subject',
})
export class SchoolSubject {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id: string;

  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;

  @ManyToMany(() => User, (user) => user.school_subjects)
  users: User[];

  @ManyToMany(() => Conversation, (conversation) => conversation.school_subjects)
  conversations: Conversation[];
}
