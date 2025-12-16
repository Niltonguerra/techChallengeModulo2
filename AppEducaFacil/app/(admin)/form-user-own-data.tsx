import Loading from "@/components/Loading";
import UserFormComponent from "@/components/UserForm/UserForm";
import UserForm from "@/components/UserForm/UserForm";
import { useSnackbar } from "@/hooks/snackbar/snackbar";
import { getUser } from "@/services/user";
import { RootState } from "@/store/store";
import { FormUserData } from "@/types/userForm";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function UserFormPage() {
  const userData = useSelector((state: RootState) => state.auth.user);
  const userId = userData?.id;
  const userPermission = userData?.permission;
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
      userType={userPermission}
      user={user}
      returnRoute='/(auth)/login'
    />
  );
}
