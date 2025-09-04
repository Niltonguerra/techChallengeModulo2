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

  const body = {
    id: "8b084b80-1083-410b-bd02-d6074dd82cfb",
    title: "Matematica",
    description:
      "Guia completo para desenvolver APIs modernas utilizando NestJS, TypeScript e boas práticas de desenvolvimento.",
    search_field: ["nestjs", "typescript", "api", "rest", "backend"],
    scheduled_publication: "2025-07-08T09:00:00Z",
    introduction:
      "Este artigo apresenta um guia detalhado sobre como criar APIs RESTful robustas e escaláveis usando NestJS e TypeScript. Você aprenderá desde a configuração inicial até a implementação de recursos avançados como autenticação, validação e documentação automática.",
    external_link: {
      documentacao: "https://docs.nestjs.com",
      github: "https://github.com/nestjs/nest",
    },
    content_hashtags: ["#nestjs", "#typescript", "#api", "#backend", "#nodejs"],
    style_id: "modern",
    image: "https://nestjs.com/img/logo-small.svg",
    author_id: "6a6f8d57-9be8-4b45-974f-cbe5cc7eab09",
  };

  try {
    const response = await api.put<Post[]>("/post", body);
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
