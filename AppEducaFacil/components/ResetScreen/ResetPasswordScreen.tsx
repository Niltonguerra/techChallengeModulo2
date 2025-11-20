import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import styleGuide from "@/constants/styleGuide";
import { useSnackbar } from "@/hooks/snackbar/snackbar";
import { sendResetPasswordEmail } from "@/services/user";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      showSnackbar({ message: "Digite seu email", duration: 3000 });
      return;
    }

    setLoading(true);
    try {
      await sendResetPasswordEmail(email);
      showSnackbar({
        message: "Email de redefinição enviado com sucesso!",
        duration: 3000,
      });
      router.replace("/login");
    } catch (err: any) {
      showSnackbar({
        message:
          err.response?.data?.message || "Erro ao enviar email de redefinição",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redefinir Senha</Text>
      <Text style={styles.subtitle}>Digite o email associado à sua conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={styleGuide.palette.main.textSecondaryColor}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleResetPassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Enviar</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.backToLogin} onPress={() => router.push("/login")}>
        Voltar para Login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      styleGuide.light.background || styleGuide.palette.main.fourthColor,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    ...styleGuide.typography.h2,
    textAlign: "center",
    marginBottom: 12,
    color: styleGuide.palette.main.textPrimaryColor,
  },
  subtitle: {
    ...styleGuide.typography.h6,
    textAlign: "center",
    marginBottom: 24,
    color: styleGuide.palette.main.textSecondaryColor,
  },
  input: {
    borderWidth: 1,
    borderColor: styleGuide.palette.main.textSecondaryColor,
    padding: 16,
    borderRadius: 10,
    backgroundColor: styleGuide.palette.light.fourthLightColor,
    color: styleGuide.palette.main.textPrimaryColor,
    marginBottom: 16,
  },
  button: {
    backgroundColor: styleGuide.palette.main.secondColor,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    ...styleGuide.typography.button,
    color: "#fff",
  },
  backToLogin: {
    color: styleGuide.palette.main.primaryColor,
    textAlign: "center",
    marginTop: 20,
    textDecorationLine: "underline",
  },
});
