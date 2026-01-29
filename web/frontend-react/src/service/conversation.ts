import type { ChatMessageProps } from "../types/conversation";
import { getApi } from "./post";

export const getMessages = async (questionId: string) => {
	const api = getApi();
	try {
		const response = await api.get(`/question/${questionId}/conversations`);
		return response.data as ChatMessageProps[];
	} catch (error) {
		console.error("Erro ao buscar mensagens:", error);
		throw error;
	}
};

export const sendMessage = async (questionId: string, message: string) => {
	const api = getApi();
	
	try {
		const response = await api.post(`/question/${questionId}/conversations`, { message });
		return response.data;
	} catch (error) {
		console.error("Erro ao enviar mensagem:", error);
		throw error;
	}
};