import { AuthModule } from '@modules/auth/auth.module';
import { CommentsModule } from '@modules/comments/comments.module';
import { Comments } from '@modules/comments/entities/comment.entity';
import { EmailModule } from '@modules/email/email.module';
import { Post } from '@modules/post/entities/post.entity';
import { PostModule } from '@modules/post/post.module';
import { User } from '@modules/user/entities/user.entity';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionModule } from './modules/question/question.module';
import { SchoolSubjectModule } from './modules/school_subject/school_subject.module';
import { SchoolSubject } from '@modules/school_subject/entities/school_subject.entity';
import { Question } from '@modules/question/entities/question.entity';
import { Conversation } from '@modules/question/entities/conversation.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        if (config.get<string>('AMBIENTE') === 'PROD') {
          return {
            type: 'postgres',
            host: config.get<string>('DB_HOST_PROD'),
            port: config.get<number>('DB_PORT_PROD'),
            username: config.get<string>('DB_USERNAME_PROD'),
            password: config.get<string>('DB_PASSWORD_PROD'),
            database: config.get<string>('DB_DATABASE_PROD'),
            autoLoadEntities: true,
            synchronize: true,
            ssl: {
              rejectUnauthorized: false,
            },
            extra: { ssl: { rejectUnauthorized: false } },
            family: 4,
            entities: [Post, User, Comments, SchoolSubject, Question, Conversation],
          };
        } else {
          return {
            type: 'postgres',
            host: config.get<string>('DB_HOST_DEV'),
            port: config.get<number>('DB_PORT_DEV'),
            username: config.get<string>('DB_USERNAME_DEV'),
            password: config.get<string>('DB_PASSWORD_DEV'),
            database: config.get<string>('DB_DATABASE_DEV'),
            autoLoadEntities: true,
            synchronize: true,
            entities: [Post, User, Comments, SchoolSubject, Question, Conversation],
            ssl: {
              rejectUnauthorized: false,
            },
          };
        }
      },
    }),
    PostModule,
    UserModule,
    AuthModule,
    EmailModule,
    CommentsModule,
    QuestionModule,
    SchoolSubjectModule,
  ],
})
export class AppModule {}
