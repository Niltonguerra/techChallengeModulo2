export type Post = {
    id: string;
    title: string;
    description: string;
    introduction: string;
    image: string | null | File;
    content_hashtags: string[];
    style_id: string;
    external_link: {[key: string]: string | undefined;};
    created_at: Date;
    updated_at: Date;
    user_name: string;
    user_email: string;
    user_social_media: {[key: string]: string | undefined;};
}

export type PostSearch = {
    advanced?: boolean;
    signal?: AbortSignal;
    search?: string | null;
    userId?: string | null;
    content?: string | null;
    createdAtBefore?: Date | null;
    createdAtAfter?: Date | null;
    offset: string;
    limit: string;
}

export type ResultApi = {
    message: string;
    statusCode: number;
    limit: number;
    offset: number;
    total: number;
    ListPost: Post[];
}

export type DeleteResponse = {
    message: string;
    statusCode: number;
    deletedId?: string;
}
