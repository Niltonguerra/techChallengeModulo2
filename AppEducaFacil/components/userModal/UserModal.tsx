import React, { useMemo } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Href, useRouter } from "expo-router";
import { RootState } from "@/store/store";
import { logout } from "@/store/authSlice";
import styleGuide from "@/constants/styleGuide";
import { UserPermissionEnum } from "@/types/userPermissionEnum";
import { MenuLink, UserModalProps } from "@/types/Menu";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const UserModal: React.FC<UserModalProps> = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  const links: MenuLink[] = useMemo(() => {
    if (!user) return [];
    const commonLinks: MenuLink[] = [
      {
        label: "Editar Meu Perfil",
        pathname: "/(admin)/form-user-own-data",
        params: {
          userId: user.id,
          userType: user.permission,
        },
      },
    ];

    if (user.permission === UserPermissionEnum.ADMIN) {
      return [
        {
          label: "Administrador de Professor",
          pathname: "/(admin)/admin-teacher",
        },
        { label: "Administrador de Aluno", pathname: "/(admin)/admin-student" },
        {
          label: "Administrador de Postagens",
          pathname: "/(admin)/admin-post",
        },
        ...commonLinks,
      ];
    }

    return commonLinks;
  }, [user]);

  const handleNavigate = (pathname: string, params?: Record<string, any>) => {
    onClose();
    router.push({
      // @ts-ignore
      pathname: pathname,
      params: params,
    });
  };

  const handleLogout = () => {
    onClose();
    dispatch(logout());
    router.replace("/(auth)/login");
  };

  if (!user) return null;

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {user.photo ? (
                <Image style={styles.avatar} source={{ uri: user.photo }} />
              ) : (
                <View style={[styles.avatar, styles.defaultIconContainer]}>
                  <MaterialCommunityIcons
                    name="account"
                    size={32}
                    color="black"
                  />
                </View>
              )}

              <Text style={styles.name}>{user.name}</Text>
              {user.email && <Text style={styles.email}>{user.email}</Text>}

              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {links.map((link, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.optionButton}
                    onPress={() => handleNavigate(link.pathname, link.params)}
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
                  style={[
                    styles.optionText,
                    { color: styleGuide.palette.error },
                  ]}
                >
                  Sair
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
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
    textAlign: "center",
  },
  email: {
    fontSize: 14,
    color: styleGuide.palette.main.textSecondaryColor,
    marginBottom: 10,
    textAlign: "center",
  },
  scrollView: {
    width: "100%",
    marginTop: 10,
    maxHeight: 300,
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 10,
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
    marginTop: 5,
  },
  closeButton: {
    marginTop: 10,
    width: "100%",
    alignItems: "center",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: styleGuide.palette.main.fourthColor,
  },
  closeText: {
    color: styleGuide.palette.main.primaryColor,
    fontSize: 16,
    fontWeight: "500",
  },
  defaultIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#cccccc",
    borderRadius: 40,
  },
});
