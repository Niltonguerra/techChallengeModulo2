import { generateQuestionForLearning, sendMessage } from "../service/conversation";
import { formatConversationToPrompt } from "../utils/promptFormatter";

export async function handleGenerateQuestionsForLearning(conversation: any,userName: string, setLoading: (loading: boolean) => void,questionId: string) {
    try {
        setLoading(true);
        const prompt = formatConversationToPrompt(conversation);
        const result = await generateQuestionForLearning(prompt);

        const newMessage = { 
            content: result,
            isUserTheAuthor: true,
            authorName: userName,
            createdAt: new Date()
        }
        
        await sendMessage(questionId, result);
        
        setLoading(false);
        return newMessage;
    } catch (error) {
        console.error("Erro na criação das perguntas de aprendizado", error);
        setLoading(false);
        throw error;
    }
}