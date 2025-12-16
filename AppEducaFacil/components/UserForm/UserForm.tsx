import React, { useRef } from 'react';
import { View, StyleSheet, TextInput as NativeTextInput } from 'react-native';
import { TextInput, Button, HelperText, List } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Controller } from 'react-hook-form';
import { styleGuide } from '@/constants/styleGuide';
import { UserPermissionEnum } from '@/types/userPermissionEnum';
import { FormUserProps } from '@/types/userForm';
import { UserImagePicker } from '../UserImagePicker/UserImagePicker';
import PasswordInput from '../passwordField/passwordField';
import { useUserForm } from '@/hooks/user/useUserSubmit';

const UserFormComponent: React.FC<FormUserProps> = ({ userId, userType = UserPermissionEnum.USER, user,returnRoute }) => {
  const emailRef = useRef<NativeTextInput>(null);
  const passwordRef = useRef<NativeTextInput>(null);
  const { control, submit, errors, setValue, isSubmitting } = useUserForm({ userId, userType, userData: user,returnRoute });

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={62}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.container}
    >
      <Controller
        control={control}
        name="imageUri"
        render={({ field: { value } }) => (
          <UserImagePicker
            imageUri={value || null}
            error={(errors.imageUri?.message || errors.photoAsset?.message) as string } 
            onImagePicked={(uri, asset) => {
              setValue('imageUri', uri,{ shouldValidate: true });
              setValue('photoAsset', asset, { shouldValidate: true });
            }}
          />
        )}
      />
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <TextInput
              label="Nome *"
              placeholder="Digite o nome completo"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              style={styles.input}
              error={!!errors.name}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
              blurOnSubmit={false}
            />
            {errors.name && (
              <HelperText type="error" style={styles.errorText} visible>
                {errors.name.message}
              </HelperText>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <TextInput
              ref={emailRef}
              label="Email *"
              placeholder="Digite o endereço de email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              error={!!errors.email}
              returnKeyType="next"
              blurOnSubmit={false}
            />
            {errors.email && (
              <HelperText type="error" style={styles.errorText} visible>
                {errors.email.message}
              </HelperText>
            )}
          </View>
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <PasswordInput
            ref={passwordRef}
            userId={userId} 
            password={value || ''}
            onPasswordChange={onChange}
            onSubmit={submit}
            error={errors.password?.message}
          />
        )}
      />

      <Button
        mode="contained"
        onPress={submit}
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
      padding: 16 
    },
    input: { 
      marginBottom: 4,
      backgroundColor: 'white' 
    },
    errorText: { 
      color: styleGuide.palette.error, 
      marginBottom: 8 
    },
    submitButton: { 
      marginTop: 24, 
      marginBottom: 32, 
      backgroundColor: styleGuide.palette.main.primaryColor 
    },
    submitContent: { 
      paddingVertical: 8 
    },
    accordionContainer: { 
      marginBottom: 16, 
      borderRadius: 6, 
      overflow: "hidden", 
      backgroundColor: styleGuide.palette.main.fourthColor, 
      borderWidth: 1, 
      borderColor: '#e0e0e0' 
    },
    accordionContent: { 
      paddingHorizontal: 16, 
      paddingBottom: 16, 
      backgroundColor: styleGuide.palette.main.fourthColor
    },
});

export default UserFormComponent;