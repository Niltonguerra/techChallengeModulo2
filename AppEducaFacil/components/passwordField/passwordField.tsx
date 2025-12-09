import { PasswordInputProps } from '@/types/userForm';
import React, { useState, forwardRef } from 'react';
import { View, StyleSheet, TextInput as NativeTextInput } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';


const PasswordInput = forwardRef<NativeTextInput, PasswordInputProps>(
  ({ userId, password, onPasswordChange, onSubmit, error }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <View>
        <TextInput
          ref={ref}
          label={userId ? "Nova senha" : "Senha *"}
          placeholder={userId ? "Digite a nova senha" : "Digite a senha"}
          value={password}
          onChangeText={onPasswordChange}
          mode="outlined"
          secureTextEntry={!showPassword}
          style={styles.input}
          error={!!error}
          right={
            <TextInput.Icon
              icon={showPassword ? "eye-off" : "eye"}
              onPress={() => setShowPassword(!showPassword)}
              forceTextInputFocus={false}
            />
          }
          returnKeyType="done"
          onSubmitEditing={onSubmit}
        />
        {error && (
          <HelperText type="error" style={styles.errorText} visible>
            {error}
          </HelperText>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
    input: {
      marginBottom: 4,
      backgroundColor: 'white',
    },
    errorText: {
      color: '#d32f2f',
      marginBottom: 8,
    },
  });

export default PasswordInput;
