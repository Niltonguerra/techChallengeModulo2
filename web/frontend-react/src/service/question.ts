import axios, { type AxiosInstance } from "axios";
import type { FormQuestionData } from "../types/form-post";

import { store } from "../store";
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

export const createQuestion = async (data: FormQuestionData)
  : Promise<{ statusCode: number; message: string }> => {
  const api = getApi();
  const response = await api.post("question/create", data);
  return response.data;
};


export const notificationClick = async (questionId: string)
  : Promise<{ statusCode: number; message: string }> => {
  const api = getApi();
  const response = await api.post(`/question/${questionId}/view`);
  return response.data;
};


export const getNotifications = async () => {
  const api = getApi();
  try {
    const response = await api.get("question/notifications");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar hashtags:", error);
    throw error;
  }
}