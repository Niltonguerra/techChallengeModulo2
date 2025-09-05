export type Post = {
    id: string;
    title: string;
    description: string;
    introduction: string;
    image: string;
    content_hashtags: string[];
    style_id: string;
    external_link: { url: string };
    created_at: Date;
    updated_at: Date;
    user_name: string;
    user_email: string;
    user_social_media: {
        twitter?: string;
        linkedin?: string;
        [key: string]: string | undefined;
    };
}

export type PostSearch = {
    advanced?: boolean;
    signal?: AbortSignal;
    search?: string | null;
    userId?: string | null;
    content?: string | null;
    createdAt?: {
        before?: Date | null;
        after?: Date | null;
    }
    offset?: number;
    limit?: number;
}

export type ResutApi = {

    message: string;
    statusCode: number;
    limit: number;
    offset: number;
    total: number;
    ListPost: Post[];
}