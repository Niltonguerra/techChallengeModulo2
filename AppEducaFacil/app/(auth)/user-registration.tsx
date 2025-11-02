import UserForm from "@/components/UserForm";
import { router } from "expo-router";

export default function UserRegistration() {
    return <UserForm afterSubmit={() => {router.replace("/")}} userType="user" />;
}