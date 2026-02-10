import axios, { type AxiosInstance } from 'axios';
import type { FormQuestionData } from '../types/form-post';

import { store } from '../store';
import { showSnackbar } from '../store/snackbar/snackbarSlice';
import type { Question } from '../types/question';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/';

let api: AxiosInstance | null = null;

export function getApi(): AxiosInstance {
  const token = sessionStorage.getItem('token');
  api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        sessionStorage.removeItem('token');

        store.dispatch(
          showSnackbar({
            message: 'Sessão expirada. Faça login novamente.',
            severity: 'error',
          })
        );

        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      }
      return Promise.reject(error);
    }
  );
  return api;
}

export const createQuestion = async (
  data: FormQuestionData
): Promise<{ statusCode: number; message: string }> => {
  const api = getApi();
  const response = await api.post('question/create', data);
  return response.data;
};

export const getQuestions = async (params?: {
  subject?: string;
  assignment?: 'UNASSIGNED' | 'MINE';
}): Promise<Question[]> => {
  const api = getApi();
  const response = await api.get('question', { params });

  return response.data;
};

export const deleteQuestion = async (id: string) => {
  const api = getApi();
  const response = await api.delete(`question/${id}`);
  return response.data;
};

export async function assignQuestion(id: string) {
  const api = getApi();
  const response = await api.patch(`/question/${id}/assign`);
  return response.data;
}

export async function closeQuestion(id: string) {
  const api = getApi();
  const response = await api.patch(`/question/${id}/close`);
  return response.data;
}
