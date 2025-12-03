import React, { useState, useRef } from 'react';
import { View, StyleSheet, TextInput as NativeTextInput } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import { TextInput, Button, HelperText, List } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styleGuide } from '@/constants/styleGuide';
import { useUserSubmit } from '@/hooks/user/useUserSubmit';
import { UserPermissionEnum } from '@/types/userPermissionEnum';
import { FormUserProps, UserSchemaType } from '@/types/userForm';
import { UserImagePicker } from '../UserImagePicker/UserImagePicker';
import PasswordInput from '../passwordField/passwordField';

const UserForm: React.FC<FormUserProps> = ({
  userId,
  userType = UserPermissionEnum.USER,
  user,
  afterSubmit = () => {}
}) => {
  const emailRef = useRef<NativeTextInput>(null);
  const passwordRef = useRef<NativeTextInput>(null);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState(user?.password || '');
  
  const [editPassword, setEditPassword] = useState(false);
  
  const [imageUri, setImageUri] = useState<string | null>(user?.photo ? String(user.photo) : null);
  const [photoAsset, setPhotoAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
  
  const [errors, setErrors] = useState<Partial<UserSchemaType>>({});
  
  const { handleUserSubmit, isSubmitting } = useUserSubmit({ userId, userType, afterSubmit });

  const handleFieldChange = (
    setter: React.Dispatch<React.SetStateAction<string>>, 
    field: keyof UserSchemaType, 
    value: string
  ) => {
    setter(value);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const onSubmitPress = () => {
    handleUserSubmit({ name, email, password, imageUri, photoAsset, setErrors });
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={62}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.container}
    >
      <UserImagePicker
        imageUri={imageUri}
        error={errors.photo}
        onImagePicked={(uri, asset) => {
          setImageUri(uri);
          setPhotoAsset(asset);
          if (errors.photo) {
            setErrors(prev => ({ ...prev, photo: undefined }));
          }
        }}
      />

      <TextInput
        label="Nome *"
        placeholder="Digite o nome completo"
        value={name}
        onChangeText={(text) => handleFieldChange(setName, 'name', text)}
        mode="outlined"
        style={styles.input}
        error={!!errors.name}
        returnKeyType="next"
        onSubmitEditing={() => emailRef.current?.focus()}
        blurOnSubmit={false}
      />
      {errors.name && (
        <HelperText type="error" style={styles.errorText} visible>
          {errors.name}
        </HelperText>
      )}

      <TextInput
        ref={emailRef}
        label="Email *"
        placeholder="Digite o endereço de email"
        value={email}
        onChangeText={(text) => handleFieldChange(setEmail, 'email', text)}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        error={!!errors.email}
        returnKeyType="next"
        onSubmitEditing={() => {
           if (!userId || editPassword) passwordRef.current?.focus();
        }}
        blurOnSubmit={false}
      />
      {errors.email && (
        <HelperText type="error" style={styles.errorText} visible>
          {errors.email}
        </HelperText>
      )}
      {!userId ? (
        <PasswordInput
          ref={passwordRef}
          userId={userId}
          password={password}
          onPasswordChange={(text) => handleFieldChange(setPassword, 'password', text)}
          onSubmit={onSubmitPress}
          error={errors.password}
        />
      ) : (
        <View style={styles.accordionContainer}>
          <List.Accordion
            title="Alterar senha"
            description="Opcional"
            expanded={editPassword}
            onPress={() => setEditPassword(!editPassword)}
            left={(props) => <List.Icon {...props} icon="lock-reset" />}
            style={{ backgroundColor: 'white' }}
          >
            <View style={styles.accordionContent}>
              <PasswordInput
                ref={passwordRef}
                userId={userId}
                password={password}
                onPasswordChange={(text) => handleFieldChange(setPassword, 'password', text)}
                onSubmit={onSubmitPress}
                error={errors.password}
              />
            </View>
          </List.Accordion>
        </View>
      )}
      <Button
        mode="contained"
        onPress={onSubmitPress}
        style={styles.submitButton}
        contentStyle={styles.submitContent}
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        {userId ? 'Atualizar Usuário' : 'Criar Usuário'}
      </Button>
    </KeyboardAwareScrollView>
  );
};

export const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 4,
    backgroundColor: 'white',
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 32,
    backgroundColor: styleGuide.palette.main.primaryColor
  },
  submitContent: {
    paddingVertical: 8,
  },
  accordionContainer: {
    marginBottom: 16,
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: '#e0e0e0', 
  },
  accordionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'white',
  },
});

export default UserForm;