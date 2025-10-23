import axios, { type AxiosInstance } from "axios";
import Constants from "expo-constants";
import type { FormPostData } from "../types/form-post";
import type { DeleteResponse, Post, PostSearch, ResultApi } from "../types/post";

const API_URL = Constants.expoConfig!.extra!.apiUrl; // diz ao TypeScript “confie em mim, isso nunca será undefined
let api: AxiosInstance | null = null;

const tokenTeste = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZkOTFiOTU0LTBjZDQtNGU0MC1iMzE5LTI1ZDg3OGFkMTIwMiIsImVtYWlsIjoiZ3VpLnBpbWVudGVsMjAwNEBnbWFpbC5jb20iLCJwZXJtaXNzaW9uIjoiYWRtaW4iLCJpYXQiOjE3NjExNTYxNzAsImV4cCI6MTc2MTI0MjU3MH0.AITvfaVqcQG8Ll_8qqHNVDxoSRaU5fOg07qjndmSrd4";

export function getApi(): AxiosInstance {
  const token = tokenTeste;
  api = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },

  });
  return api;
}

export const getListTodos = async (): Promise<Post[]> => {
  const api = getApi();
  const response = await api.get<ResultApi>("post");
  return response.data.ListPost;
};


export const getHashtags = async (): Promise<string[]> => {
  const api = getApi();
  const response = await api.get("post/hashtags");
  return response.data;
};

export const getListById = async (id: string): Promise<ResultApi> => {
  const api = getApi();
  const response = await api.get<ResultApi>(`post/${id}`);
  return response.data;
};

export const deletePost = async (id: string): Promise<DeleteResponse> => {
  const api = getApi();
  const response = await api.delete<DeleteResponse>(`post/${id}`);
  return response.data;
};

export const fetchPosts = async (data: PostSearch): Promise<any> => {
  const api = getApi();
  const { advanced = false, signal, search, userId, content, createdAt, offset, limit } = data;

  let params: Record<string, any> = {
    search: advanced ? search : search ?? null,
    offset,
    limit,
  };

  if (advanced) {
    params = {
      ...params,
      userId: userId ?? null,
      content: content ?? null,
      createdAt: createdAt ?? null,
    };
  }

  const dataReturn = await api.get<ResultApi>('/post', {
    params,
    signal,
  });
  return dataReturn.data.ListPost;
}

export const updatePost = async (data: Partial<FormPostData>)
  : Promise<{ statusCode: number, message: string }> => {
  const api = getApi();
  const response = await api.put("post", data);
  return response.data;
};

export const createPost = async (data: FormPostData)
  : Promise<{ statusCode: number; message: string }> => {
  const api = getApi();
  const response = await api.post("post", data);
  return response.data;
};