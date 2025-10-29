import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { RootState } from "@/store/store";
import { logout } from "@/store/authSlice";
import styleGuide from "@/constants/styleGuide";
import { UserPermissionEnum } from "@/types/userPermissionEnum";

interface UserModalProps {
  visible: boolean;
  onClose: () => void;
}

type AppRoutes =
  | "/(tabs)/edit-user-data"
  | "/(tabs)/persona-info"
  | "/(tabs)/admin-teacher"
  | "/(tabs)/admin-student"
  | "/(tabs)/admin-posts"
  | "/(tabs)/register-teacher"
  | "/(auth)/login";

export const UserModal: React.FC<UserModalProps> = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) return null;

  const userLinks = [
    { label: "Editar Dados", pathname: "/(tabs)/edit-user-data" },
    { label: "Informações Pessoais", pathname: "/(tabs)/persona-info" },
  ];

  const adminLinks = [
    {
      label: "Administrador de Professor",
      pathname: "/(tabs)/admin-teacher",
    },
    { label: "Administrador de Aluno", pathname: "/(tabs)/admin-student" },
    {
      label: "Cadastrar Professor",
      pathname: "/(tabs)/register-teacher",
    },
    { label: "Administrador de Postagens", pathname: "/(tabs)/admin-post" },
    { label: "Editar Dados", pathname: "/(tabs)/edit-user-data" },
    { label: "Informações Pessoais", pathname: "/(tabs)/persona-info" },
  ];

  const links =
    user.permission === UserPermissionEnum.ADMIN ? adminLinks : userLinks;

  const handleNavigate = (pathname: string) => {
    onClose();
    router.push(pathname as any );
  };

  const handleLogout = () => {
    dispatch(logout());
    onClose();
    router.replace("/(auth)/login");
  };

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
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

          <ScrollView
            style={{ width: "100%", marginTop: 10 }}
            contentContainerStyle={{ alignItems: "center" }}
          >
            {links.map((link, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => handleNavigate(link.pathname)}
              >
                <Text style={styles.optionText}>{link.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

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
      </View>
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
  modalContainer: {
    backgroundColor: styleGuide.light.background,
    width: "85%",
    borderRadius: 20,
    alignItems: "center",
    padding: 20,
    shadowColor: styleGuide.dark.background,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: "80%",
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
    marginBottom: 10,
  },
  optionButton: {
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: styleGuide.palette.main.fourthColor,
    width: "100%",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    color: styleGuide.palette.main.textPrimaryColor,
  },
  logoutButton: {
    borderColor: styleGuide.palette.main.fourthColor,
    borderTopWidth: 1,
  },
  closeButton: {
    marginTop: 10,
  },
  closeText: {
    color: styleGuide.palette.main.primaryColor,
    fontSize: 16,
    fontWeight: "500",
  },
});
