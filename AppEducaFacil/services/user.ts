import axios, { type AxiosInstance } from "axios";
import Constants from "expo-constants";
import { RequestUser, ResponseAuthUser } from "@/types/login";
import { FormUserData } from "@/types/form-post";
import { ReturnMessage } from "@/types/returnMessaget";

const API_URL = Constants.expoConfig!.extra!.apiUrl ?? "http://192.168.0.10:3000";

export function getApi(): AxiosInstance {
  return axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
  });
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

export const getAuthors = async () => {
  const api = getApi();
  const response = await api.get("post/hashtags");
  return response.data;
};