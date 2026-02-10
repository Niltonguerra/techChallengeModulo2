import axios, { type AxiosInstance } from "axios";
import { store } from "../store";
import { showSnackbar } from "../store/snackbar/snackbarSlice";
import type { NotificationItem } from "../types/questionView";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/";

let api: AxiosInstance | null = null;

export function getApi(): AxiosInstance {
  const token = sessionStorage.getItem("token");
  api = axios.create({
    baseURL:  API_URL,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`},
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

export const getUnreadNotifications = async (): Promise<NotificationItem[]> => {
  const api = getApi();
  const response = await api.get('/questionView/notifications/unread');

  return response.data;
};