import { store } from "@/store/store";
import axios, { type AxiosInstance } from "axios";
import Constants from "expo-constants";
import type { Comments } from "../types/post";

const API_URL = Constants.expoConfig!.extra!.apiUrl;

let api: AxiosInstance | null = null;

function getApi(): AxiosInstance {
    const state = store.getState();
    const token = state.auth.token;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    api = axios.create({
        baseURL: API_URL,
        headers,
    });

    return api;
}

export type CommentCreatePayload = {
    content: string;
    postId: string;
};


export const createComment = async (
    payload: CommentCreatePayload
): Promise<Comments> => {
    const api = getApi();
    const response = await api.post<Comments>("/comments", payload);
    // Converter createdAt para Date
    return response.data;
};


export const deleteComment = async (commentId: string): Promise<void> => {
    const api = getApi();
    await api.delete(`/comments/${commentId}`);
};


export const getCommentsByPost = async (postId: string): Promise<Comments[]> => {
    const api = getApi();
    const response = await api.get<Comments[]>(`/post/${postId}`);
    return response.data;
};
