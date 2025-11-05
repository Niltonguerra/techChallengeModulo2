
export type UserSummary = {
    id: string;
    name: string;
    photo: string;
}

export type Comments = {
    id: string;
    content: string;
    createdAt: string;
    user: UserSummary;
}