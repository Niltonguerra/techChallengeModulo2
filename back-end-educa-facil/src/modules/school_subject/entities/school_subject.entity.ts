import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@modules/user/entities/user.entity';
import { Question } from '@modules/question/entities/question.entity';

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

  @ManyToMany(() => Question, (question) => question.school_subjects)
  questions: Question[];
}
