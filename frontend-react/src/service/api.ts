import axios from "axios";
import type { Post } from "../types/post"; // <- aqui você usa o type que você já criou

const TOKEN = "SEU_TOKEN_AQUI";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
});

export const getListTodos = async (): Promise<Post[]> => {
  try {
    const body = {
    "id": "8b084b80-1083-410b-bd02-d6074dd82cfb",
    "title": "Matematica",
    "description": "Guia completo para desenvolver APIs modernas utilizando NestJS, TypeScript e boas práticas de desenvolvimento.",
    "search_field": ["nestjs", "typescript", "api", "rest", "backend"],
    "scheduled_publication": "2025-07-08T09:00:00Z",
    "introduction": "Este artigo apresenta um guia detalhado sobre como criar APIs RESTful robustas e escaláveis usando NestJS e TypeScript. Você aprenderá desde a configuração inicial até a implementação de recursos avançados como autenticação, validação e documentação automática.",
    "external_link": {
        "documentacao": "https://docs.nestjs.com",
        "github": "https://github.com/nestjs/nest"
    },
    "content_hashtags": ["#nestjs", "#typescript", "#api", "#backend", "#nodejs"],
    "style_id": "modern",
    "image": "https://nestjs.com/img/logo-small.svg",
    "author_id": "6a6f8d57-9be8-4b45-974f-cbe5cc7eab09"
}

    const response = await api.put<Post[]>("/post", body);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao chamar getListTodos:", error.response?.data || error);
    throw error;
  }
};
