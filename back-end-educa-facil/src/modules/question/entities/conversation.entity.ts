import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';

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

  @Column({
    name: 'created_at',
    type: 'varchar',
  })
  created_at: string;
}
