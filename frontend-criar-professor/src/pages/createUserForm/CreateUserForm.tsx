import CreateUserForm from "../../components/FormUser/FormUser";

export function CreateEditUserFormPage() {
  const permission = 'admin';
  return (
    <>
      <CreateUserForm permission={permission} />
    </>
  );
}
