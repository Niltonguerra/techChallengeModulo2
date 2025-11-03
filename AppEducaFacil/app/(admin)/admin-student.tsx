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

export default function AlunosScreen() {
  const [students, setStudents] = useState<any[]>([]);
  const token = useSelector((state: RootState) => state.auth.token);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  useEffect(() => {
    async function fetchStudents() {
      try {
        if (!token) return;
        const users = await getAllUsers(token, "user");
        setStudents(users);
      } catch (err) {
        showSnackbar({
          message: "Não foi possível carregar os alunos.",
          duration: 3000,
        });
      }
    }
    fetchStudents();
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
        {students.map((student) => (
          <CardUser
            key={student.id}
            isEditable
            dataProperties={{
              id: student.id,
              name: student.name,
              photo: student.photo,
              email: student.email,
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
            pathname: "/(admin)/user/form",
            params: { userType: "user" },
          }}
          asChild
        >
          <Button
            mode="contained"
            style={{ ...styles.submitButton, ...styles.halfButton }}
            contentStyle={styles.submitContent}
          >
            Criar Aluno
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
