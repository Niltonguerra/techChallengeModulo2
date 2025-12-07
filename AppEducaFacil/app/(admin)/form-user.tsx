import Loading from "@/components/Loading";
import UserFormComponent from "@/components/UserForm/UserForm";
import UserForm from "@/components/UserForm/UserForm";
import { useSnackbar } from "@/hooks/snackbar/snackbar";
import { getUser } from "@/services/user";
import { FormUserData } from "@/types/userForm";
import { UserPermissionEnum } from "@/types/userPermissionEnum";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";


export default function UserFormPage() {
  const { userId, userType } = useLocalSearchParams<{ userId?: string; userType?: UserPermissionEnum }>();
  const [loading, setLoading] = useState(!!userId);
  const { showSnackbar } = useSnackbar();
  const [user, setUser] = useState<FormUserData | null>(null);

    useEffect(() => {
      if (userId) {
        getUser('id', userId)
          .then((userData: FormUserData) => {
            setUser(userData);
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
            showSnackbar({
              message: "Não foi possível carregar os dados do usuário.",
              duration: 3000,
            });
          }).finally(() => {
            setLoading(false);
          });
      }
    }, [userId]);


  if (loading)  return  <Loading />;

  return (
    <UserFormComponent
      userId={userId}
      userType={userType}
      user={user}
      returnRoute={userType === UserPermissionEnum.ADMIN ? '/(admin)/admin-teacher' : '/(admin)/admin-student'}
    />
  );
}
