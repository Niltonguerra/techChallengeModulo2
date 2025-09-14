import axios, { type AxiosInstance } from "axios";
import type { Post, ResutApi } from "../types/post";
import Swal from 'sweetalert2';
import type { FormPostData } from "../types/form-post";

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE4MjZkOWJmLTdkNDAtNDI1Yi1hOGI5LWMwMTUwOWMyMmY3ZiIsImVtYWlsIjoibmlsdG9uZGcuMzlAZ21haWwuY29tIiwicGVybWlzc2lvbiI6ImFkbWluIiwiaWF0IjoxNzU3ODc3MTM2LCJleHAiOjE3NTc5NjM1MzZ9.xsIOsaLSirfBBFCZvUToty4vWlKG3zxtMJ8j7fdwzv4';
import type { Post, ResutApi, DeleteResponse } from "../types/post";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJjZDA3Y2FlLWQwNTktNGM1MS05ODViLWNjMWY0ZGNiYmQwMSIsImVtYWlsIjoiZ3VpLnBpbWVudGVsMjAwNEBnbWFpbC5jb20iLCJwZXJtaXNzaW9uIjoiYWRtaW4iLCJpYXQiOjE3NTc1NTI3NTQsImV4cCI6MTc1NzYzOTE1NH0.jCom0d0THHoS46sBDQEhnoth3C_1H_psWMC2W6BC63g";
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


export const getListById = async (id: string): Promise<ResutApi | null> => {
  try {
    const api = getApi();
    const response = await api.get<ResutApi>(`/post/${id}`);
    if (response.data.statusCode === 200) {
      return response.data;
    }
   throw new Error(`problemas para buscar os dados para o id ${id}.`);
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "alguma coisa deu errado!"
    });
    throw new Error(`Post with id ${id} not found., error: ${error}`);
  }
};

export const updatePost = async (data: Partial<FormPostData>)
  :Promise<{statusCode: number,message: string}> => {
  try {
    const api = getApi();
    api.put("/post", data)
    .then(response => {
      console.log(response.data);
          if (response.data.statusCode === 200) {
      Swal.fire({
        title: "sucesso!",
        icon: "success",
        text: "a postagem foi atualizada com sucesso!",
        draggable: true
      });
      return response.data;
    }
    })
    .catch(error => {
      console.error(error);
    });
   throw new Error(`problemas para atualizar a postagem com o id: ${data.id}.`);
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "alguma coisa deu errado!"
    });
    throw new Error(`Post with id ${data.id} can't be updated, error: ${error}`);
  }
};

export const createPost = async (data: FormPostData) => {
  try {
    const api = getApi();
    api.post("/post", data)
    .then(response => {
      console.log(response.data);
          if (response.data.statusCode === 200) {
      Swal.fire({
        title: "sucesso!",
        icon: "success",
        text: "a postagem foi criada com sucesso!",
        draggable: true
      });
      return response.data;
    }
    })
    .catch(error => {
      console.error(error);
    });
   throw new Error(`problemas para criar a postagem com o id: ${data.id}.`);
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "alguma coisa deu errado!"
    });
    throw new Error(`Post with id ${data.id} can't be created, error: ${error}`);
  }
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

/*
// 🔹 Criar post
export const createPost = async (data: Omit<Post, "id" | "created_at" | "updated_at">): Promise<Post> => {
  const api = getApi();
  try {
    const response = await api.post<Post>("/post", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar post:", error);
    throw error;
  }
};

// 🔹 Atualizar post
export const updatePost = async (id: string, data: Partial<Post>): Promise<Post> => {
  const api = getApi();
  try {
    const response = await api.put<Post>(`/post/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar post ${id}:`, error);
    throw error;
  }
};

*/
