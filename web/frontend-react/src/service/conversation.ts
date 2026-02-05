import type { ChatMessageProps } from "../types/conversation";
import { getApi } from "./post";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY_GEMINI = import.meta.env.VITE_API_KEY_GEMINI;

export const getMessages = async (questionId: string): Promise<ChatMessageProps[]> => {
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

export const generateQuestionForLearning = async (prompt: string) => {
  const genAI = new GoogleGenerativeAI(API_KEY_GEMINI);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Erro ao gerar perguntas com Gemini:", error);
    throw error;
  }
};