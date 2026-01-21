import axios, { type AxiosInstance } from "axios";
import { store } from "../store";
import { showSnackbar } from "../store/snackbar/snackbarSlice";
import type { DropdownOption } from "../types/dropdown";

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

export const getSchoolSubjectsDropdown = async (): Promise<DropdownOption[]> => {
    const api = getApi();
    try {
        const response = await api.get<DropdownOption[]>(
            '/school-subject/dropdown',
        );
        return response.data;
    } catch (error) {
        console.error('Erro ao chamar getSchoolSubjectsDropdown:', error);
        throw error;
    }
};

