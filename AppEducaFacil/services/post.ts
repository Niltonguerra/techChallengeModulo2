import { store } from "@/store/store";
import axios, { type AxiosInstance } from "axios";
import Constants from "expo-constants";
import type { FormPostData } from "../types/form-post";
import type {
  DeleteResponse,
  Post,
  PostSearch,
  ResultApi,
} from "../types/post";

const API_URL = Constants.expoConfig!.extra!.apiUrl; 
let api: AxiosInstance | null = null;

export function getApi(): AxiosInstance {
  const state = store.getState();
  const token = state.auth.token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const api = axios.create({
    baseURL: API_URL,
    headers: headers,
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
  const {
    advanced = false,
    signal,
    search,
    userId,
    content,
    createdAtBefore,
    createdAtAfter,
    offset,
    limit,
  } = data;

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
      createdAtBefore: createdAtBefore ?? null,
      createdAtAfter: createdAtAfter ?? null,
    };
  }

  const dataReturn = await api.get<ResultApi>("/post", {
    params,
    signal,
  });
  return dataReturn.data.ListPost;
};

export const updatePost = async (
  data: Partial<FormPostData>
): Promise<{ statusCode: number; message: string }> => {
  const api = getApi();
  const response = await api.put("post", data);
  return response.data;
};

export const createPost = async (
  data: FormPostData
): Promise<{ statusCode: number; message: string }> => {
  const api = getApi();
  const response = await api.post("post", data);
  return response.data;
};
