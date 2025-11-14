import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import UserForm from "@/components/UserForm";
import Header from "@/components/header/header";
import { View } from "react-native";

export default function EditUserDataScreen() {
    const user = useSelector((state: RootState) => state.auth.user);

    if (!user) return null;

    return (
        <View>
            <Header title="Editar" />
            <View style={{ marginBottom: 20 }} />
            <UserForm userId={user.id} userType={user.permission} />
        </View>
    );
}
