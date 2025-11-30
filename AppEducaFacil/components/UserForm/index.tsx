import React, { useState, useEffect } from "react";
import { View, Alert, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { TextInput, Button, HelperText, List } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { userFormStyles as styles } from "./styles";
import type { FormUserData, FormUserProps } from "@/types/form-post";
import { createUser, EditUser, getUser } from "@/services/user";
import { router } from "expo-router";
import Loading from "../Loading";
import { imgbbUmaImagem } from "@/services/imgbb";

const UserForm: React.FC<FormUserProps> = ({
  userId,
  userType = "user",
  afterSubmit = () => {},
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [photoAsset, setPhotoAsset] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const [loading, setLoading] = useState(!!userId);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    photo?: string;
  }>({});

  useEffect(() => {
    if (userId) {
      getUser("id", userId)
        .then((userData: FormUserData) => {
          setName(userData.name);
          setPassword("");
          setEmail(userData.email);
          setImageUri(
            typeof userData.photo === "string" ? userData.photo : null
          );
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          Alert.alert("Error", "Could not load user data.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId]);

  const handlePickImage = async (): Promise<void> => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert(
          "Permission required",
          "Permission to access the photo library is required to select an image."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (result.canceled || !result.assets?.length) return;

      const asset = result.assets[0];
      setImageUri(asset.uri);
      setPhotoAsset(asset);
    } catch (error) {
      console.warn("Error picking image:", error);
    }
  };

  const validate = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      photo?: string;
    } = {};

    const trimmedName = name?.trim();
    if (!trimmedName) {
      newErrors.name = "O campo Nome é obrigatório";
    } else if (trimmedName.length < 2 || trimmedName.length > 100) {
      newErrors.name = "O campo Nome deve ter entre 2 e 100 caracteres";
    }

    const trimmedEmail = email?.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      newErrors.email = "O campo Email é obrigatório";
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = "Endereço de email inválido";
    }

    if (!userId) {
      if (!password) {
        newErrors.password = "O campo Senha é obrigatório";
      } else if (password.length < 6 || password.length > 48) {
        newErrors.password = "O campo Senha deve ter entre 6 e 48 caracteres";
      }
    } else {
      if (
        password?.length > 0 &&
        (password.length < 6 || password.length > 48)
      ) {
        newErrors.password = "O campo Senha deve ter entre 6 e 48 caracteres";
      }
    }

    if (!imageUri) {
      newErrors.photo = "O campo Foto é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validate()) {
      return;
    }
    setIsSubmitting(true);

    const actionFunction = userId ? EditUser : createUser;

    const formData: FormUserData = {
      id: userId || undefined,
      name: name,
      email: email,
      password: password.length > 0 ? password : undefined,
      photo: imageUri,
      permission: userType,
    };

    if (photoAsset) {
      try {
        const cdn = await imgbbUmaImagem(photoAsset);
        formData.photo = cdn.data?.url || cdn.data?.display_url;
      } catch {
        setIsSubmitting(false);
        Alert.alert(
          "Erro",
          "Erro ao fazer upload da imagem! Favor contactar o suporte."
        );
        return;
      }
    }

    actionFunction(formData)
      .then(() => {
        setIsSubmitting(false);

        const message = userId
          ? "Usuário editado com sucesso!\nFaça login novamente para aplicar as alterações."
          : "Usuário criado com sucesso!";

        Alert.alert("Sucesso", message);

        if (afterSubmit) afterSubmit();
      })
      .catch((error) => {
        setIsSubmitting(false);
        console.error("user form error:", error);
        Alert.alert("Erro", "Ocorreu um erro ao enviar o formulário.");
      });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        extraScrollHeight={62}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
      >
        <View style={styles.imagePickerSection}>
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={styles.imagePreview}
              resizeMode="cover"
            />
          )}
          <Button
            mode="outlined"
            onPress={handlePickImage}
            icon="image"
            style={styles.pickImageButton}
          >
            {imageUri ? "Alterar Foto" : "Selecione uma Foto"}
          </Button>
          {errors.photo && (
            <HelperText type="error" style={styles.errorText} visible>
              {errors.photo}
            </HelperText>
          )}
        </View>

        <TextInput
          label="Nome *"
          placeholder="Digite o nome completo"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          error={!!errors.name}
          returnKeyType="next"
        />
        {errors.name && (
          <HelperText type="error" style={styles.errorText} visible>
            {errors.name}
          </HelperText>
        )}

        <TextInput
          label="Email *"
          placeholder="Digite o endereço de email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          error={!!errors.email}
          returnKeyType="next"
        />
        {errors.email && (
          <HelperText type="error" style={styles.errorText} visible>
            {errors.email}
          </HelperText>
        )}

        {!userId && (
          <TextInput
            label="Senha *"
            placeholder="Digite a senha"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            style={styles.input}
            error={!!errors.password}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            returnKeyType="next"
          />
        )}

        {userId && (
          <View style={styles.accordionContainer}>
            <List.Accordion
              title="Alterar senha"
              description="Opcional"
              expanded={editPassword}
              onPress={() => setEditPassword(!editPassword)}
              left={(props) => <List.Icon {...props} icon="lock-reset" />}
            >
              <View>
                <TextInput
                  label="Nova senha"
                  placeholder="Digite a nova senha"
                  value={password}
                  onChangeText={setPassword}
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  style={{ padding: 0, ...styles.input, marginRight: 15 }}
                  error={!!errors.password}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? "eye-off" : "eye"}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                  returnKeyType="next"
                />
              </View>
            </List.Accordion>
          </View>
        )}

        {errors.password && (
          <HelperText type="error" style={styles.errorText} visible>
            {errors.password}
          </HelperText>
        )}

        <View style={styles.buttonRow}>
          <Button
            mode="contained"
            onPress={() => {
              router.back();
            }}
            style={{ ...styles.submitButton, ...styles.halfButton }}
            contentStyle={styles.submitContent}
            disabled={isSubmitting}
          >
            Voltar
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={{ ...styles.submitButton, ...styles.halfButton }}
            contentStyle={styles.submitContent}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {userId ? "Atualizar Usuário" : "Criar Usuário"}
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default UserForm;
