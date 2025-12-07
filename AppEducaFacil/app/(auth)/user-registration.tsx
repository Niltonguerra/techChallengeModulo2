import Header from "@/components/header/header";
import UserFormComponent from "@/components/UserForm/UserForm";
import UserForm from "@/components/UserForm/UserForm";
import { UserPermissionEnum } from "@/types/userPermissionEnum";
import { router } from "expo-router";
import { View } from "react-native";

export default function UserRegistration() {
    return (
        <View>
            <Header title="Cadastro de Usuário" />
            <View style={{marginBottom: 20}} />
            <UserFormComponent
            userId={undefined}
            userType={UserPermissionEnum.USER}
            user={null}
            returnRoute='/(auth)/login'
            />
        </View>
    )
}