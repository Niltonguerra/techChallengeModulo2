import { useParams } from "react-router-dom";
import CreateUserForm from "../../components/FormUser/FormUser";

export function CreateEditUserFormPage() {
  const params = useParams<{ permission: string }>();
  const permission = params.permission;
  return (
    <>
      <CreateUserForm permission={permission!} />
    </>
  );
}
