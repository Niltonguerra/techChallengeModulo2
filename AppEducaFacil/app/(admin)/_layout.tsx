import { Stack } from "expo-router";
import React from "react";
import Header from "@/components/header/header";

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        header: ({ route }) => (
          <Header title={`Admin - ${route.name.replace("-", " ")}`} showBack />
        ),
      }}
    >
      <Stack.Screen name="admin-teacher" />
      <Stack.Screen name="admin-student" />
      <Stack.Screen name="admin-post" />
      <Stack.Screen name="post/form" />
      <Stack.Screen name="user/form" />

    </Stack>
  );
}
