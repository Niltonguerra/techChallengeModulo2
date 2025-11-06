import { Stack } from "expo-router";
import React from "react";
import Header from "@/components/header/header";

export default function AdminLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="admin-teacher"
        options={{
          header: () => <Header title="Professores" showBack={false} />,
        }}
      />
      <Stack.Screen
        name="admin-student"
        options={{
          header: () => <Header title="Alunos" showBack={false} />,
        }}
      />
      <Stack.Screen
        name="admin-post"
        options={{
          header: () => <Header title="Postagens" showBack={false} />,
        }}
      />
      <Stack.Screen
        name="post/form"
        options={{
          header: () => <Header title="Gerir Postagem" showBack />,
        }}
      />
      <Stack.Screen
        name="user/form"
        options={{
          header: () => <Header title="Gerir Usuário" showBack />,
        }}
      />
    </Stack>
  );
}
