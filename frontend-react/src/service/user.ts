import axios, { type AxiosInstance } from "axios";
import type { FormUserData } from "../types/form-post";
import type { ResponseAuthUser } from "../types/login";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/";

let api: AxiosInstance | null = null;

// todo: expired token, logout, etc
export function getApi(): AxiosInstance {
  if (!api) {
    api = axios.create({
      baseURL:  API_URL,
      headers: { "Content-Type": "application/json"},
    });
  }
  return api;
}

export const createUser = async (data: FormUserData)
  : Promise<{ statusCode: number; message: string }> => {
  const api = getApi();
  const response = await api.post("user/create", data);
  return response.data;
};
export const loginUser = async (email: string, password: string)
  : Promise<ResponseAuthUser> => {
  const api = getApi();
  const response = await api.post("user/login", { email, password });
  return response.data;
}


export const getAuthors = async () => {
  const api = getApi();
  try {
    const response = await api.get("post/hashtags");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar hashtags:", error);
    throw error;
  }
};