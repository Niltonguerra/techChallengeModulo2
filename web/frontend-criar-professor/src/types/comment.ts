
export type UserSummary = {
    name: string;
    photo: string;
}

export type Comment = {
    id: string;
    content: string;
    createdAt: Date;
    user: UserSummary;
}