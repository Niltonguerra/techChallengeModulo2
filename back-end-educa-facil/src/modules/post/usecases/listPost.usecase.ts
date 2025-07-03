import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { Repository, Like } from 'typeorm';
import { ListPostDTO } from '../DTOs/listPost.DTO';
import { ReturnListPostDTO } from '../DTOs/returnlistPost.DTO';

@Injectable()
export class listPostUseCase {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
    ) { }

    async execute(query: ListPostDTO): Promise<ReturnListPostDTO[]> {
        const { offset = 0, limit = 10, search } = query;

        const where = search
            ? [
                { title: Like(`%${search}%`) },
                { description: Like(`%${search}%`) },
            ]
            : {};

        const [posts, total_post] = await this.postRepository.findAndCount({
            where,
            skip: offset,
            take: limit,
            order: { created_at: 'DESC' },
        });

        return posts.map(post => ({
            title: post.title,
            description: post.description,
            introduction: post.description?.substring(0, 100) || '',
            external_link: '', // preencha se já tiver na entidade
            content_hashtags: [] as string[], // idem
            style_id: '', // idem
            image: post.image,
            createdAt: post.created_at,
            updatedAt: post.updated_at,
            total_post,
            author_id: {
                name: '', // dependerá de relação com user
                email: '',
                social_midia: '',
            },
        }));

    }
}
