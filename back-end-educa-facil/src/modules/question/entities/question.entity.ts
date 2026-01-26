import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '@modules/user/entities/user.entity';
import { Conversation } from './conversation.entity';
import { SchoolSubject } from '@modules/school_subject/entities/school_subject.entity';

export enum QuestionStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

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

  @Column({
    name: 'status',
    type: 'enum',
    enum: QuestionStatus,
    default: QuestionStatus.OPEN,
  })
  status: QuestionStatus;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'admin_id' })
  admin: User;

  @Column({ name: 'admin_id', nullable: true })
  admin_id: string;

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

  @ManyToMany(() => SchoolSubject, (subject) => subject.questions)
  @JoinTable({
    name: 'question_school_subjects',
    joinColumn: {
      name: 'question_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'school_subject_id',
      referencedColumnName: 'id',
    },
  })
  school_subjects: SchoolSubject[];

  @OneToOne(() => Conversation, (conversation) => conversation.question)
  conversation: Conversation;

  @Column({
    name: 'created_at',
    type: 'varchar',
  })
  created_at: string;
}
