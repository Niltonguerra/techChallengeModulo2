import { useSelector } from "react-redux";
import CreateQuestionForm from "../../components/FormQuestion/FormQuestion";
import type { RootState } from "../../store";
import { initialFormQuestionState } from "../../constants/formConstants";

export function CreateQuestionPageForm() {
  const { user } = useSelector((state: RootState) => state.user);

  const formData = {
    ...initialFormQuestionState,
    author_id: user?.id || ''
  };

  return (
    <>
      <CreateQuestionForm {...formData} />
    </>
  );
}
