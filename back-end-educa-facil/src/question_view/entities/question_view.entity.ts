import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from '@modules/user/entities/user.entity';
import { Question } from '@modules/question/entities/question.entity';

@Entity({ name: 'question_view' })
@Unique(['user', 'question'])
export class QuestionView {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Question)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @Column({ type: 'timestamptz' })
  last_seen_at: Date;
}
