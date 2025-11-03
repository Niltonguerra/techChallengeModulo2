import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { createUser } from "@/services/user";
import type { FormUserData } from "@/types/form-post";
import { useSnackbar } from "@/hooks/snackbar/snackbar";
import styleGuide from "@/constants/styleGuide";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { UserPermissionEnum } from "@/types/userPermissionEnum";

interface Props {
  permission: UserPermissionEnum;
  userId?: string;
  afterSubmit?: () => void;
}

export default function CreateUserForm({ permission, userId, afterSubmit }: Props) {
  const { showSnackbar } = useSnackbar();
  const navigation = useNavigation();
  const [form, setForm] = useState<FormUserData>({
    name: "",
    email: "",
    password: "",
    photo: null,
    permission: permission as UserPermissionEnum,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formTitle = permission === "user" ? "Criar Usuário" : "Criar Professor";

  const handleChange = (field: keyof FormUserData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      showSnackbar({
        message: "Precisamos de acesso à galeria!",
        duration: 3000,
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setForm((prev) => ({ ...prev, photo: uri }));
      setImagePreview(uri);
    }
  };

  const handleSubmit = async () => {
    setErrors({});

    if (!form.name || !form.email || !form.password) {
      showSnackbar({
        message: "Preencha todos os campos obrigatórios!",
        duration: 3000,
      });
      return;
    }

    try {
      setLoading(true);

      const dataToSend = new FormData();
      dataToSend.append("name", form.name);
      dataToSend.append("email", form.email);
      dataToSend.append("password", form.password || "");
      dataToSend.append("permission", form.permission || "");

      if (form.photo && typeof form.photo === "string") {
        const filename = form.photo.split("/").pop() || "photo.jpg";
        const type = `image/${filename.split(".").pop()}`;
        dataToSend.append("photo", {
          uri: form.photo,
          type,
          name: filename,
        } as any);
      }

      const response = await createUser(dataToSend as any);

      showSnackbar({
        message: response.message || "Usuário criado com sucesso!",
        duration: 3000,
      });
      navigation.goBack();
    } catch (error: any) {
      console.error(error);
      showSnackbar({
        message: error.response?.data?.message || "Falha ao criar usuário.",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>{formTitle}</Text>

        <TouchableOpacity style={styles.imagePicker} onPress={handleImage}>
          {imagePreview ? (
            <Image source={{ uri: imagePreview }} style={styles.image} />
          ) : (
            <Text style={styles.imageText}>Selecionar Imagem</Text>
          )}
        </TouchableOpacity>

        <TextInput
          placeholder="Nome*"
          value={form.name}
          onChangeText={(v) => handleChange("name", v)}
          style={[styles.input, errors.name && styles.errorInput]}
        />

        <TextInput
          placeholder="E-mail*"
          value={form.email}
          onChangeText={(v) => handleChange("email", v)}
          keyboardType="email-address"
          autoCapitalize="none"
          style={[styles.input, errors.email && styles.errorInput]}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Senha*"
            secureTextEntry={!showPassword}
            value={form.password}
            onChangeText={(v) => handleChange("password", v)}
            style={[styles.input, styles.passwordInput]}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.showButton}
          >
            <MaterialCommunityIcons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color={styleGuide.palette.main.primaryColor}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.submitText}>Enviar</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: styleGuide.light.background || styleGuide.palette.main.fourthColor,
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    color: styleGuide.palette.main.primaryColor,
    fontSize: 16,
  },
  card: {
    backgroundColor: styleGuide.palette.light.fourthLightColor,
    borderRadius: 12,
    padding: 24,
    elevation: 3,
  },
  title: {
    ...styleGuide.typography.h3,
    textAlign: "center",
    marginBottom: 16,
    color: styleGuide.palette.main.textPrimaryColor,
  },
  imagePicker: {
    alignItems: "center",
    justifyContent: "center",
    height: 150,
    borderWidth: 1,
    borderColor: styleGuide.palette.main.textSecondaryColor,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: styleGuide.palette.light.fourthLightColor,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  imageText: {
    color: styleGuide.palette.main.textSecondaryColor,
  },
  input: {
    borderWidth: 1,
    borderColor: styleGuide.palette.main.textSecondaryColor,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: styleGuide.palette.light.fourthLightColor,
    color: styleGuide.palette.main.textPrimaryColor,
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 80,
  },
  showButton: {
    position: "absolute",
    right: 10,
    top: 12,
  },
  showButtonText: {
    color: styleGuide.palette.main.primaryColor,
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: styleGuide.palette.main.primaryColor,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  submitText: {
    ...styleGuide.typography.button,
    color: styleGuide.typography.button.color,
  },
  submitDisabled: {
    opacity: 0.7,
    backgroundColor: styleGuide.palette.main.textSecondaryColor,
  },
  errorInput: {
    borderColor: styleGuide.palette.error,
  },
});
