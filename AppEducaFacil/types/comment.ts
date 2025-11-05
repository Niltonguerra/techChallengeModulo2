
export type UserSummary = {
    name: string;
    photo: string;
}

export type Comments = {
    id: string;
    content: string;
    createdAt: string;
    user: UserSummary;
}