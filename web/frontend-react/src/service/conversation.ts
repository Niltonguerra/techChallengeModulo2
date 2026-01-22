import type { ChatMessageProps } from "../types/conversation";
import { getApi } from "./user";

export const getMessages = async (conversationId: string) => {
	const api = getApi();
	try {
		const mockMessages: ChatMessageProps[] = [ //<< undo mock when back is ready
			{
				content: "Have you ever heard the tragedy of Darth Plagueis The Wise?",
				authorName: "Keler",
				isUserTheAuthor: false,
				createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
			},
			{
				content:
					"???",
				authorName: "Perebal",
				isUserTheAuthor: true,
				createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
			},
			{
				content: "Is a Sith legend.",
				authorName: "Keler",
				isUserTheAuthor: false,
				createdAt: new Date(new Date().setHours(16, 19, 0, 0)),
			},
			{
				content: "Darth Plagueis was a Dark Lord of the Sith so powerful and so wise he could use the Force to influence the midichlorians to create life...",
				authorName: "Keler",
				isUserTheAuthor: false,
				createdAt: new Date(new Date().setHours(16, 20, 0, 0)),
			},
			{
				content: "Senhor, aqui é uma pizzaria",
				authorName: "Perebal",
				isUserTheAuthor: true,
				createdAt: new Date(new Date().setHours(16, 20, 0, 0)),
			},
			{
				content: "He had such a knowledge of the dark side that he could even keep the ones he cared about from dying.",
				authorName: "Keler",
				isUserTheAuthor: false,
				createdAt: new Date(new Date().setHours(16, 21, 0, 0)),
			},
			{
				content: "Vou chamar a polícia",
				authorName: "Perebal",
				isUserTheAuthor: true,
				createdAt: new Date(new Date().setHours(16, 22, 0, 0)),
			},
			{
				content: "The dark side of the Force is a pathway to many abilities some consider to be unnatural.",
				authorName: "Keler",
				isUserTheAuthor: false,
				createdAt: new Date(new Date().setHours(16, 23, 0, 0)),
			}
		];

		//<< undo mock when back is ready
		return mockMessages;
		const response = await api.get("conversation/get-messages/" + conversationId);
		return response.data as ChatMessageProps[];
	} catch (error) {
		console.error("Erro ao buscar mensagens:", error);
		throw error;
	}
};

export const sendMessage = async (conversationId: string, message: string, authorId: string) => {
	const api = getApi();
	try {
		//<< undo mock when back is ready
		return {};
		const response = await api.post("conversation/send-message", {
			conversationId,
			message,
			authorId,
		});
		return response.data;
	} catch (error) {
		console.error("Erro ao enviar mensagem:", error);
		throw error;
	}
};