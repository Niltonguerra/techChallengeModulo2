import { useConfirm } from '@/hooks/modalConfirm/ConfirmModal';
import { useSnackbar } from '@/hooks/snackbar/snackbar';
import { deleteUser } from '@/services/user';
import { useRouter } from 'expo-router';

export function useDeleteUser() {
  const { confirm } = useConfirm();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  const handleDeleteUser = async (id: string,returnRoute: string) => {
    const ok = await confirm({
      message: 'Deseja realmente deletar este item?',
      TextButton1: 'Cancelar',
      TextButton2: 'Deletar',
    });

    if (ok) {
      try {
        await deleteUser(id);
        showSnackbar({ message: 'Usuário deletado com sucesso!', duration: 3000 });
        if(returnRoute) {
          router.push({// @ts-ignore 
          pathname: returnRoute
          });
        }
      } catch {
        showSnackbar({ message: 'Erro ao deletar o usuário!', duration: 3000 });
      }
    } else {
      showSnackbar({ message: 'Ação cancelada', duration: 3000 });
    }
  };
  
  return { handleDeleteUser };
}
