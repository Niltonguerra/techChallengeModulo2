import Loading from "@/components/Loading";
import UserForm from "@/components/UserForm/UserForm";
import { useSnackbar } from "@/hooks/snackbar/snackbar";
import { getUser } from "@/services/user";
import { FormUserData } from "@/types/userForm";
import { UserPermissionEnum } from "@/types/userPermissionEnum";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";


export default function UserFormPage() {
  const { userId, userType } = useLocalSearchParams<{ userId?: string; userType?: string }>();
  const router = useRouter();
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
              message: "Não foi possível carregar os posts.",
              duration: 3000,
            });
          }).finally(() => {
            setLoading(false);
          });
      }
    }, [userId]);


  if (loading)  return  <Loading />;

  return (
    <UserForm
      userId={userId}
      userType={userType === UserPermissionEnum.ADMIN ? UserPermissionEnum.ADMIN : UserPermissionEnum.USER}
      user={user}
      afterSubmit={() => {
        router.back(); 
      }}
    />
  );
}
