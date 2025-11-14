import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import UserForm from "@/components/UserForm";

export default function EditUserDataScreen() {
    const user = useSelector((state: RootState) => state.auth.user);
    
    if (!user) return null;

    return (
        <UserForm
            userId={user.id}
            userType={user.permission}
        />
    );
}
