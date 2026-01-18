import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';
import { SchoolSubject } from '@modules/school_subject/entities/school_subject.entity';

@Entity({
  name: 'conversation',
})
export class Conversation {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id: string;

  @Column({
    name: 'id_user',
    type: 'varchar',
  })
  id_user: string;

  @Column({
    name: 'message',
    type: 'varchar',
  })
  message: string;

  @OneToOne(() => Question, (question) => question.conversation)
  @JoinColumn({
    name: 'question_id',
  })
  question: Question;

  @ManyToMany(() => SchoolSubject, (school_subject) => school_subject.conversations)
  @JoinTable({
    name: 'conversation_school_subjects',
    joinColumn: {
      name: 'conversation_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'school_subject_id',
      referencedColumnName: 'id',
    },
  })
  school_subjects: SchoolSubject[];

  @Column({
    name: 'created_at',
    type: 'varchar',
  })
  created_at: string;
}
