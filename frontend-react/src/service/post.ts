import axios, { type AxiosInstance } from "axios";
import type { FormPostData } from "../types/form-post";
import type { Post, ResultApi, DeleteResponse } from "../types/post";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE4MjZkOWJmLTdkNDAtNDI1Yi1hOGI5LWMwMTUwOWMyMmY3ZiIsImVtYWlsIjoibmlsdG9uZGcuMzlAZ21haWwuY29tIiwicGVybWlzc2lvbiI6ImFkbWluIiwiaWF0IjoxNzU3OTgzNjYwLCJleHAiOjE3NTgwNzAwNjB9.i1HuAVJpcNDhN4oNLt3Hbk35YB6AxRMk56lz2JeMQL4";
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

let api: AxiosInstance | null = null;

// todo: expired token, logout, etc
export function getApi(): AxiosInstance {
  if (!api) {
    const token = localStorage.getItem("token") || TOKEN;

    api = axios.create({
      baseURL:  API_URL,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
  }
  return api;
}

export const getListTodos = async (): Promise<Post[]> => {
  const api = getApi();

  try {
    const response = await api.get<ResultApi>("/post");
    return response.data.ListPost;
  } catch (error) {
    console.error("Erro ao chamar getListTodos:", error);
    throw error;
  }
};


export const getHashtags = async () => {
  const api = getApi();
  try {
    const response = await api.get("/post/hashtags");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar hashtags:", error);
    throw error;
  }
};


export const getListById = async (id: string): Promise<ResultApi> => {
    const api = getApi();
    const response = await api.get<ResultApi>(`/post/${id}`);
    if (response.data.statusCode === 200) {
      return response.data;
    }
   throw new Error(`problemas para buscar os dados para o id ${id}.`);
};

export const updatePost = async (data: Partial<FormPostData>)
  : Promise<{ statusCode: number, message: string }> => {
    const api = getApi();
    const response = await api.put("/post", data);
    return response.data;
};

export const createPost = async (data: FormPostData)
  : Promise<{ statusCode: number; message: string }> => {
    const api = getApi();
    const response = await api.post("/post", data);
    return response.data;
};
export const deletePost = async (id: string): Promise<DeleteResponse> => {
  const api = getApi();
  try {
    const response = await api.delete<DeleteResponse>(`/post/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar post ${id}:`, error);
    throw error;
  }
};
