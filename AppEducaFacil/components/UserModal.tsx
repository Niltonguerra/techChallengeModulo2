import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { RootState } from "@/store/store";
import { logout } from "@/store/authSlice";
import styleGuide from "@/constants/styleGuide";

interface UserModalProps {
  visible: boolean;
  onClose: () => void;
}

export const UserModal: React.FC<UserModalProps> = ({ visible, onClose }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    onClose();
    dispatch(logout());
    router.replace("/(auth)/login");
  };

  if (!user) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPressOut={onClose}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container} onStartShouldSetResponder={() => true}>
            <Image
              source={{
                uri:
                  user.photo ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png",
              }}
              style={styles.avatar}
            />
            <Text style={styles.name}>{user.name}</Text>
            {user.email && <Text style={styles.email}>{user.email}</Text>}

            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>Editar Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>Configurações</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, styles.logoutButton]}
              onPress={handleLogout}
            >
              <Text
                style={[styles.optionText, { color: styleGuide.palette.error }]}
              >
                Sair
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  safeArea: {
    width: "100%",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    width: "85%",
    borderRadius: 20,
    alignItems: "center",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: styleGuide.palette.main.textPrimaryColor,
  },
  email: {
    fontSize: 14,
    color: styleGuide.palette.main.textSecondaryColor,
    marginBottom: 20,
  },
  optionButton: {
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: "#eee",
    width: "100%",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    color: styleGuide.palette.main.textPrimaryColor,
  },
  logoutButton: {
    borderColor: "#eee", // Borda sutil
  },
  closeButton: {
    marginTop: 15,
  },
  closeText: {
    color: styleGuide.palette.main.primaryColor,
    fontSize: 16,
    fontWeight: "500",
  },
});
