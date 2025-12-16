import React, { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import CardUser from "@/components/CardUser/CardUser";
import { getAllUsers } from "@/services/user";
import styleGuide from "@/constants/styleGuide";
import { Link, useRouter } from "expo-router";
import { useSnackbar } from "@/hooks/snackbar/snackbar";
import { UserPermissionEnum } from "@/types/userPermissionEnum";

export default function ProfessoresScreen() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const token = useSelector((state: RootState) => state.auth.token);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  useEffect(() => {
    async function fetchTeachers() {
      try {
        if (!token) return;
        const users = await getAllUsers(UserPermissionEnum.ADMIN);
        setTeachers(users);
      } catch (err) {
        showSnackbar({
          message: "Não foi possível carregar os professores.",
          duration: 3000,
        });
      }
    }
    fetchTeachers();
  }, [token]);

  if (!currentUser || currentUser.permission !== "admin") {
    return (
      <View style={[styles.restricted, { backgroundColor: styleGuide.light.background }]}>
        <Button mode="contained" disabled>
          Acesso restrito
        </Button>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: styleGuide.light.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {teachers.map((teacher) => (
          <CardUser
            key={teacher.id}
            returnRoute="/(admin)/admin-teacher"
            isEditable
            dataProperties={{
              id: teacher.id,
              name: teacher.name,
              photo: teacher.photo,
              email: teacher.email,
              permission: teacher.permission,
            }}
          />
        ))}
      </ScrollView>

      <View style={styles.buttonRow}>
        <Button
          mode="contained"
          onPress={() => router.replace("/(tabs)")}
          style={{ ...styles.submitButton, ...styles.halfButton }}
          contentStyle={styles.submitContent}
        >
          Voltar
        </Button>

        <Link
          href={{
            pathname: "/(admin)/form-user",
            params: { userType: UserPermissionEnum.ADMIN },
          }}
          asChild
        >
          <Button
            mode="contained"
            style={{ ...styles.submitButton, ...styles.halfButton }}
            contentStyle={styles.submitContent}
          >
            Criar Professor
          </Button>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  restricted: { flex: 1, justifyContent: "center", alignItems: "center" },
  submitButton: {
    marginTop: 24,
    marginBottom: 32,
    backgroundColor: styleGuide.palette.main.primaryColor,
  },
  submitContent: { paddingVertical: 8 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
    paddingHorizontal: 16,
  },
  halfButton: { flexBasis: "47%" },
});
