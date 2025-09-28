import axios, { type AxiosInstance } from "axios";
import type { FormUserData } from "../types/form-post";

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
    console.log('createUser data:', data);
  const api = getApi();
  const response = await api.post("user/create", data);
  return response.data;
};
export const loginUser = async (email: string, password: string)
  : Promise<{ statusCode: number; message: string; token?: string; user?: any }> => {
    console.log('loginUser email:', email);
  const api = getApi();
  const response = await api.post("user/login", { email, password });
  return response.data;
}

