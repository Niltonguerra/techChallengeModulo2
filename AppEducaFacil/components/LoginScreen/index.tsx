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
import { useDispatch } from "react-redux";
import { loginUserService } from "@/services/user";
import { useSnackbar } from "@/hooks/snackbar/snackbar";
import styleGuide from "@/constants/styleGuide";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { loginSuccess } from "@/store/authSlice";
import { AppDispatch } from "@/store/store";
import { RequestUser, ResponseAuthUser } from "@/types/login";

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { showSnackbar } = useSnackbar();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      showSnackbar({
        message: "Preencha todos os campos",
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const data: RequestUser = { email, password };
      const response: ResponseAuthUser = await loginUserService(data);

      dispatch(
        loginSuccess({
          user: {
            ...response.user,
            role: response.user.permission === "admin" ? "admin" : "user",
          },
          token: response.token,
        })
      );
      showSnackbar({
        message: `Bem-vindo ${response.user.name}`,
        duration: 3000,
      });
      router.replace("/(tabs)");
    } catch (err: any) {
      showSnackbar({
        message: err.response?.data?.message || "Usuário ou senha incorretos",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titlelogin}>Login</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, styles.inputWithIcon]}
          placeholder="Digite aqui o seu usuário*"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor={styleGuide.palette.main.textSecondaryColor}
        />
      </View>

      <View style={[styles.inputRow, styles.passwordRow]}>
        <TextInput
          style={[styles.input, styles.inputWithIcon]}
          placeholder="Digite aqui a sua senha*"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor={styleGuide.palette.main.textSecondaryColor}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.showIconButton}
        >
          <MaterialCommunityIcons
            name={showPassword ? "eye-off" : "eye"}
            size={22}
            color={styleGuide.palette.main.primaryColor}
          />
        </TouchableOpacity>
      </View>

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
      <Text style={styles.text} onPress={() => { router.push('/user-registration') }}>Não Possui registro? Registre-se aqui</Text>
      <Text style={styles.text}>Dúvidas ou precisa de alguma ajuda?</Text>
      <Text style={styles.text}>
        <MaterialCommunityIcons
          name="phone"
          size={16}
          color={styleGuide.palette.main.primaryColor}
          style={styles.contactIcon}
        />
        (11) 93231-3383
      </Text>
      <Text style={styles.text}>
        <MaterialCommunityIcons
          name="email-outline"
          size={16}
          color={styleGuide.palette.main.primaryColor}
          style={styles.contactIcon}
        />
        educacaofacilfiap@gmail.com
      </Text>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleGuide.light.background || styleGuide.palette.main.fourthColor,
    justifyContent: "center",
    padding: 24,
  },
  titlelogin: {
    ...styleGuide.typography.h2,
    textAlign: "center",
    marginBottom: 22,
    marginTop: 20,
    color: styleGuide.palette.main.textPrimaryColor,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginLeft: 32,
    marginRight: 32,
  },
  iconLeft: {
    marginRight: 8,
  },
  inputWithIcon: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: styleGuide.palette.main.textSecondaryColor,
    padding: 16,
    borderRadius: 10,
    backgroundColor: styleGuide.palette.light.fourthLightColor,
    color: styleGuide.palette.main.textPrimaryColor,
  },
  passwordRow: {
    position: "relative",
  },
  showIconButton: {
    position: "absolute",
    right: 8,
    padding: 8,
  },
  button: {
    backgroundColor: styleGuide.palette.main.secondColor,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 32,
    marginRight: 32,
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    ...styleGuide.typography.button,
    color: styleGuide.typography.button.color,
  },
  text: {
    color: styleGuide.palette.main.primaryColor,
    fontSize: 14,
    marginTop: 20,
    textAlign: "center",
  },
  titleregister: {
    ...styleGuide.typography.h3,
    textAlign: "center",
    marginBottom: 12,
    marginTop: 24,
    color: styleGuide.palette.main.textPrimaryColor,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  contactIcon: {
    marginRight: 8,
  },
});
