import Header from "@/components/header/header";
import UserForm from "@/components/UserForm/UserForm";
import { router } from "expo-router";
import { View } from "react-native";

export default function UserRegistration() {
    return (
        <View>
            <Header title="Cadastro de Usuário" />
            <View style={{marginBottom: 20}} />
            <UserForm afterSubmit={() => {router.replace("/")}} userType="user" />
        </View>
    )
}