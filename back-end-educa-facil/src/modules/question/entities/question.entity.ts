import { Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@modules/user/entities/user.entity';
import { Conversation } from './conversation.entity';

@Entity({
  name: 'question',
})
export class Question {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id: string;

  @Column({
    name: 'title',
    type: 'varchar',
  })
  title: string;

  @Column({
    name: 'description',
    type: 'varchar',
  })
  description: string;

  @ManyToMany(() => User, (user) => user.questions)
  @JoinTable({
    name: 'question_users',
    joinColumn: {
      name: 'question_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: User[];

  @Column({
    name: 'id_school_subject',
    type: 'varchar',
  })
  id_school_subject: string;

  @OneToOne(() => Conversation, (conversation) => conversation.question)
  conversation: Conversation;

  @Column({
    name: 'created_at',
    type: 'varchar',
  })
  created_at: string;
}
