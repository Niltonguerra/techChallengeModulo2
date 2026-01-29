import { useNavigate, useParams } from "react-router-dom";
import Conversation from "../../components/Conversation/Conversation";

export default function ConversationPage() {
  const navigate = useNavigate();
  const { questionId } = useParams<{ questionId: string }>();

  console.log('conversation from question: ', questionId);

  if (!questionId) {
    navigate(-1);
    return null;
  }

  return (
    <Conversation questionId={questionId} onConcludeConversation={() => navigate('/questions')} />
  );
}