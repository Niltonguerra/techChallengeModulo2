import React from 'react';
import { View, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import { Button, HelperText } from 'react-native-paper';
import { useSnackbar } from '@/hooks/snackbar/snackbar'; // Seu hook existente

interface UserImagePickerProps {
  imageUri: string | null;
  error?: string;
  onImagePicked: (uri: string, asset: ImagePicker.ImagePickerAsset) => void;
}

export const UserImagePicker: React.FC<UserImagePickerProps> = ({ 
  imageUri, 
  error, 
  onImagePicked 
}) => {
  const { showSnackbar } = useSnackbar();

  const handlePickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permission.status !== "granted") {
        showSnackbar({
          message: "Permissão necessária para acessar a galeria.",
          duration: 3000
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        // Devolvemos a URI e o Asset para o componente pai
        onImagePicked(asset.uri, asset);
      }
    } catch (err) {
      console.warn("Erro ao selecionar imagem:", err);
      Alert.alert("Erro", "Não foi possível selecionar a imagem.");
    }
  };

  return (
    <View style={styles.container}>
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

      {error && (
        <HelperText type="error" visible style={styles.errorText}>
          {error}
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  pickImageButton: {
    alignSelf: 'center',
  },
  errorText: {
    marginTop: 4,
    textAlign: 'center',
  },
});