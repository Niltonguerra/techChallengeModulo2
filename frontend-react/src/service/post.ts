import axios, { type AxiosInstance } from "axios";
import type { FormPostData } from "../types/form-post";
import type { DeleteResponse, Post, ResultApi } from "../types/post";
import { store } from "../store"; // store Redux
import { showSnackbar } from "../store/snackbar/snackbarSlice";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/";

let api: AxiosInstance | null = null;


export function getApi(): AxiosInstance {
  const token = sessionStorage.getItem("token");
  api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
   api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        sessionStorage.removeItem("token");
        
        store.dispatch(
          showSnackbar({
            message: "Sessão expirada. Faça login novamente.",
            severity: "error",
          })
        );

        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      }
      return Promise.reject(error);
    }
  );
  return api;
}

export const getListTodos = async (): Promise<Post[]> => {
  const api = getApi();
  try {
    const response = await api.get<ResultApi>("post");
    return response.data.ListPost;
  } catch (error) {
    console.error("Erro ao chamar getListTodos:", error);
    throw error;
  }
};


export const getHashtags = async () => {
  const api = getApi();
  try {
    const response = await api.get("post/hashtags");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar hashtags:", error);
    throw error;
  }
};

export const getListById = async (id: string): Promise<ResultApi> => {
  const api = getApi();
  const response = await api.get<ResultApi>(`post/${id}`);
  if (response.data.statusCode === 200) {
    return response.data;
  }
  throw new Error(`problemas para buscar os dados para o id ${id}.`);
};

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
export const deletePost = async (id: string): Promise<DeleteResponse> => {
  const api = getApi();
  try {
    const response = await api.delete<DeleteResponse>(`post/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar post ${id}:`, error);
    throw error;
  }
};

export const fetchPosts = async (data: PostSearch):Promise<any> => {
  const api = getApi();
  const {advanced = false,signal,search,userId,content,createdAt,offset,limit} = data;

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
   return dataReturn.ListPost;
}