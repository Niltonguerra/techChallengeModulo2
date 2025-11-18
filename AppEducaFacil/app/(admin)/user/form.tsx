import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import UserForm from "@/components/UserForm";

export default function UserFormPage() {
  const { userId, userType } = useLocalSearchParams<{ userId?: string; userType?: string }>();
  const router = useRouter();

  return (
    <UserForm
      userId={userId}
      userType={userType === "admin" ? "admin" : "user"}
      afterSubmit={() => {
        router.back(); 
      }}
    />
  );
}
