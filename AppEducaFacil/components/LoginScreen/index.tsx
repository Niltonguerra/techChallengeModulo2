import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { loginUserService } from "@/services/user";
import { RequestUser } from "@/types/login";
import { styles } from "./styles";

export default function LoginScreen() {
  const router = useRouter();

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
      const response = await loginUserService(data);

      Alert.alert("Sucesso", `Bem-vindo ${response.user.name}`);
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Erro", err.response?.data?.message || "Usuário ou senha incorretos");
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

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
      </TouchableOpacity>

      <Text style={styles.titleregister}>Faça o seu registro</Text>
      <Text style={styles.text}>Não Possui registro? Registre-se aqui</Text>
      <Text style={styles.text}>Dúvidas ou precisa de alguma ajuda?</Text>
      <Text style={styles.text}>(11) 93231-3383</Text>
      <Text style={styles.text}>educacaofacilfiap@gmail.com</Text>
    </View>
  );
}
