import axios, { type AxiosInstance } from "axios";
import Constants from "expo-constants";
import { RequestUser, ResponseAuthUser } from "@/types/login";
import { FormUserData } from "@/types/form-post";
import { ReturnMessage } from "@/types/returnMessaget";
import { store } from "@/store/store";

const API_URL = Constants.expoConfig!.extra!.apiUrl; 
let api: AxiosInstance | null = null;

export function getApi(): AxiosInstance {
  const state = store.getState();
  const token = state.auth.token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const api = axios.create({
    baseURL: API_URL,
    headers: headers,
  });
  return api;
}
export const loginUserService = async (data: RequestUser): Promise<ResponseAuthUser> => {
  const api = getApi();
  const response = await api.post("user/login", data);
  return response.data;
};

export const createUser = async (data: FormUserData)
  : Promise<ReturnMessage> => {
  const api = getApi();
  const response = await api.post("user/create", data);
  return response.data;
};

export const getUser = async (field: string, value: string) => {
  const api = getApi();

  const response = await api.get("user/findOne", {
    params: {
      field,
      value,
    },
  });
  
  return response.data.user;
};

export const getAuthors = async () => {
  const api = getApi();
  const response = await api.get("post/hashtags");
  return response.data;
};

export const getAllUsers = async (permission?: 'user' | 'admin') => {
  const api = getApi();
  const response = await api.get('user/list-all', {
    params: permission ? { permission } : {},
  });
  return response.data; 
};

export const EditUser = async (data: FormUserData)
  : Promise<ReturnMessage> => {
  const api = getApi();
  const response = await api.put(`/user/edit/${data.id}`, data);
  return response.data;
};

export const deleteUser = async (id: string)
  : Promise<ReturnMessage> => {
  const api = getApi();
  const response = await api.delete(`user/delete/${id}`);
  return response.data;
};
  