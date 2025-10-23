import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { loginUserService } from "@/services/user";
import { loginSuccess } from "@/store/authSlice";
import { AppDispatch } from "@/store/store";
import { RequestUser, ResponseAuthUser } from "@/types/login";

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      const data: RequestUser = { email, password };
      const response: ResponseAuthUser = await loginUserService(data);

      dispatch(loginSuccess({ user: response.user, token: response.token }));

      Alert.alert("Sucesso", `Bem-vindo ${response.user.name}`);
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert(
        "Erro",
        err.response?.data?.message || "Usuário ou senha incorretos"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titlelogin}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite aqui o seu usuário*"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Digite aqui a sua senha*"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.titleregister}>Faça o seu registro</Text>
      <Text style={styles.text}>Não Possui registro? Registre-se aqui</Text>
      <Text style={styles.text}>Dúvidas ou precisa de alguma ajuda?</Text>
      <Text style={styles.text}>(11) 93231-3383</Text>
      <Text style={styles.text}>educacaofacilfiap@gmail.com</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 24,
  },
  titlelogin: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 22,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    marginLeft: 32,
    marginRight: 32,
  },
  button: {
    backgroundColor: "#F57005",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 32,
    marginRight: 32,
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  text: {
    color: "#4953B8",
    fontSize: 14,
    marginTop: 20,
    textAlign: "center",
  },
  titleregister: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    marginTop: 24,
  },
});
