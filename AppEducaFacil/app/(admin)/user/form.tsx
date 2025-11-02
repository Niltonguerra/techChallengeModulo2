import { useLocalSearchParams } from "expo-router";
import React from "react";
import UserForm from "@/components/UserForm";

export default function UserFormPage() {
  const { userId, userType } = useLocalSearchParams<{ userId?: string; userType?: string }>();

  return (
    <UserForm
      userId={userId}
      userType={userType === "admin" ? "admin" : "user"}
      afterSubmit={() => {
        history.back();
      }}
    />
  );
}
