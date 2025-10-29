
import React, { useState, useEffect, use } from 'react';
import {
  View,
  ScrollView,
  Alert,
  Image
} from 'react-native';
import * as ImagePicker from "expo-image-picker";
import {
  TextInput,
  Button,
  HelperText,
  Text,
  List
} from 'react-native-paper';
// Import styles and type definitions from separate modules
import { userFormStyles as styles } from './styles'
import type { FormUserData, FormUserProps } from '@/types/form-post';
import { createUser, EditUser, getUser } from '@/services/user';


const UserForm: React.FC<FormUserProps> = ({
  userId,
  userType = 'user',
  afterSubmit = () => {}, // function of redirect, refresh, etc goes here
}) => {
  // field states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  // password hidden or not
  const [showPassword, setShowPassword] = useState(false);
  // in case of editing, if we are going to open the password field or not
  const [editPassword, setEditPassword] = useState(false);

  const [imageUri, setImageUri] = useState<File | string | null>(null);

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
      getUser('id', userId)
        .then((userData: FormUserData) => {
          setName(userData.name);
          setPassword(''); // we don't fetch the password for security reasons (especially since teachers can also edit users)
          setEmail(userData.email);
          setImageUri(userData.photo);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          Alert.alert("Error", "Could not load user data.");
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

      // only update the state if the user actually selects an image
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
      }
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
    const trimmedName = name.trim();
    if (!trimmedName) {
      newErrors.name = 'O campo Nome é obrigatório';
    } else if (trimmedName.length < 2 || trimmedName.length > 100) {
      newErrors.name = 'O campo Nome deve ter entre 2 e 100 caracteres';
    }
    // Email: required and must match be withing email regex
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      newErrors.email = 'O campo Email é obrigatório';
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Endereço de email inválido';
    }
    // Password: required, min 6, max 48 characters (unless we are editing, then password field can be blank)
    if (!userId) {
      if (!password) {
        newErrors.password = 'O campo Senha é obrigatório';
      } else if (password.length < 6 || password.length > 48) {
        newErrors.password = 'O campo Senha deve ter entre 6 e 48 caracteres';
      }
    } else {
      if(password?.length > 0 && (password.length < 6 || password.length > 48)) {
        newErrors.password = 'O campo Senha deve ter entre 6 e 48 caracteres';
      }
    }

    // Photo: required
    if (!imageUri) {
      newErrors.photo = 'O campo Foto é obrigatório';
    }

    setErrors(newErrors);
    // if there are no errors, the form is valid, returns true.
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission. Validates the form then creates/updates a teacher/student
   */
  const handleSubmit = (): void => {
    if (!validate()) {
      // When validation fails, don't proceed with submission
      return;
    }
    const actionFunction = userId ? EditUser : createUser;
    const formData: FormUserData = {
      id: userId || undefined,
      name: name.trim(),
      email: email.trim(),
      password: password.length > 0 ? password : undefined, // only send password if it's been set
      photo: imageUri,
      permission: userType,
    };

    actionFunction(formData).then((response) => {
      Alert.alert("Sucesso", response.message);
      if (afterSubmit) afterSubmit();
    }).catch((error) => {
      console.error("user form error:", error);
      Alert.alert("Erro", "Ocorreu um erro ao enviar o formulário.");
    });
  };

  return (
    <View>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
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
                  style={{ padding: 0, ...styles.input }}
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
        
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          contentStyle={styles.submitContent}
        >
          {userId ? 'Atualizar Usuário' : 'Criar Usuário'}
        </Button>
      </ScrollView>
    </View>
  );
};

export default UserForm;