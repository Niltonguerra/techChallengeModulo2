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
    user: {
        id: string;
        name: string;
        email: string;
        social_media: string[];
    };
}