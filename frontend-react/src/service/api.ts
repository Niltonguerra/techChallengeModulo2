import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import type { Post } from "../types/post";

const TOKEN = "e9d58f1d-a3ad-4d1e-a6a7-d84cefaa303ceyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM4MmQxY2EzLWVjNDEtNDZmMy05MDdjLThkZGMyOTIwZWI3NyIsImVtYWlsIjoibHVpczUwODI1QGdtYWlsLmNvbSIsInBlcm1pc3Npb24iOiJhZG1pbiIsImlhdCI6MTc1MjgwODgxMSwiZXhwIjoxNzUyODk1MjExfQ.mIgtA4OekN_baE_YddfO-9HjmeYVHDIctG-dWcU8iik";
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

let api: AxiosInstance | null = null;

// todo: expired token, logout, etc
export function getApi(): AxiosInstance {
  if (!api) {
    const token = localStorage.getItem("token") || TOKEN;

    api = axios.create({
      baseURL: API_URL,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
  }
  return api;
}

export const getListTodos = async (): Promise<Post[]> => {
  const api = getApi();

  try {
    const response = await api.get<Post[]>("/post");
    return response.data;
  } catch (error: any) {
    console.error("Erro ao chamar getListTodos:", error.response?.data || error);
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
