import { SetMetadata } from '@nestjs/common';

export const Post = (...args: string[]) => SetMetadata('post', args);
