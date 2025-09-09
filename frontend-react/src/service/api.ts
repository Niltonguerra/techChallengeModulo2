import axios, { type AxiosInstance } from "axios";
import type { Post, ResutApi } from "../types/post";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhjM2Q5YzY1LTdhOWEtNDUxNC04ZWRmLTdlMmUxY2I1M2QwZSIsImVtYWlsIjoibHVpczUwODI0QGdtYWlsLmNvbSIsInBlcm1pc3Npb24iOiJhZG1pbiIsImlhdCI6MTc1NzM1MDY5NSwiZXhwIjoxNzU3NDM3MDk1fQ.eFvKnnxhfuJSv09NHTVW7w1RSLCiwQ94Exw5Pk1WGqE";
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

let api: AxiosInstance | null = null;

// todo: expired token, logout, etc
export function getApi(): AxiosInstance {
  if (!api) {
    const token = localStorage.getItem("token") || TOKEN;

    api = axios.create({
      baseURL: API_URL, //API_URL// ,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
  }
  return api;
}

export const getListTodos = async (): Promise<Post[]> => {
  const api = getApi();

  try {
    const response = await api.get<ResutApi>("/post");
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
