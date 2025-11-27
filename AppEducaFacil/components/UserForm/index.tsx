import React, { useState, useEffect, use } from "react";
import { View, ScrollView, Alert, Image, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  TextInput,
  Button,
  HelperText,
  Text,
  List,
  ActivityIndicator
} from 'react-native-paper';
import { userFormStyles as styles } from './styles'
import type { FormUserData, FormUserProps } from '@/types/form-post';
import { createUser, EditUser, getUser } from '@/services/user';
import { router } from 'expo-router';
import Loading from '../Loading';
import { imgbbUmaImagem } from '@/services/imgbb';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const UserForm: React.FC<FormUserProps> = ({
  userId,
  userType = "user",
  afterSubmit = () => {}, // function of redirect, refresh, etc goes here
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // field states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // password hidden or not
  const [showPassword, setShowPassword] = useState(false);
  // in case of editing, if we are going to open the password field or not
  const [editPassword, setEditPassword] = useState(false);

  const [imageUri, setImageUri] = useState<File | string | null>(null);
  const [photoAsset, setPhotoAsset] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  // loading state for fetching existing user data in case of editing
  const [loading, setLoading] = useState(!!userId);

  // displays the validation errors for each field - populated by the validate()
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    photo?: string;
  }>({});

  // getting the info of the existing user, if we are editing
  useEffect(() => {
    if (userId) {
      getUser("id", userId)
        .then((userData: FormUserData) => {
          setName(userData.name);
          setPassword(""); // we don't fetch the password for security reasons (especially since teachers can also edit users)
          setEmail(userData.email);
          setImageUri(userData.photo);
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

  /**
   * Dealing with the img upload. for that we need to ask for permission and then open the image picker.
   */
  const handlePickImage = async (): Promise<void> => {
    try {
      // requesting permissions to use library
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
        quality: 0.7, // i might just be old but i remember a bug if you set quality to 1
      });

      if (result.canceled || !result.assets?.length) return;

      const photoAsset = result.assets[0];
      setImageUri(photoAsset.uri);
      setPhotoAsset(photoAsset);
    } catch (error) {
      console.warn("Error picking image:", error);
    }
  };

  /**
   * Validate the form fields according to backend DTO requirements.
   * Populates the `errors` state with messages for each invalid field.
   *
   * @returns true if there are no errors in the validation. false otherwise
   */
  const validate = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      photo?: string;
    } = {};
    // Name: required, min 2, max 100 characters
    const trimmedName = name?.trim();
    if (!trimmedName) {
      newErrors.name = "O campo Nome é obrigatório";
    } else if (trimmedName.length < 2 || trimmedName.length > 100) {
      newErrors.name = "O campo Nome deve ter entre 2 e 100 caracteres";
    }
    // Email: required and must match be withing email regex
    const trimmedEmail = email?.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      newErrors.email = "O campo Email é obrigatório";
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = "Endereço de email inválido";
    }
    // Password: required, min 6, max 48 characters (unless we are editing, then password field can be blank)
    if (!userId) {
      if (!password) {
        newErrors.password = "O campo Senha é obrigatório";
      } else if (password.length < 6 || password.length > 48) {
        newErrors.password = "O campo Senha deve ter entre 6 e 48 caracteres";
      }
    } else {
      if (password?.length > 0 && (password.length < 6 || password.length > 48)) {
        newErrors.password = 'O campo Senha deve ter entre 6 e 48 caracteres';
      }
    }

    // Photo: required
    if (!imageUri) {
      newErrors.photo = "O campo Foto é obrigatório";
    }

    console.error("set errors: ", newErrors);

    setErrors(newErrors);
    // if there are no errors, the form is valid, returns true.
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission. Validates the form then creates/updates a teacher/student
   */
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
      password: password.length > 0 ? password : undefined, // only send password if it's been set
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
          ? "Faça login novamente para aplicar as alterações."
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
    return (
      <Loading />
    );
  }

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={62}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.container}
    >
      {/* image selection and preview */}
      <View style={styles.imagePickerSection}>
        {imageUri && (
          <Image
            source={{ uri: imageUri ? imageUri.toString() : "" }}
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

      {/* if the user is being edited, we don't show the existing password. but we still allow the user to change it */}
      {/* creating a new user - should always show the password field normally */}
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
          {userId ? 'Atualizar Usuário' : 'Criar Usuário'}
        </Button>
      </View>
    </KeyboardAwareScrollView>

  );
};

export default UserForm;
