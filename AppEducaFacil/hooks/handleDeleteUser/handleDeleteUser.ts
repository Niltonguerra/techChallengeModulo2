import { useConfirm } from '@/hooks/modalConfirm/ConfirmModal';
import { useSnackbar } from '@/hooks/snackbar/snackbar';
import { deleteUser } from '@/services/user';

export function useDeleteUser() {
  const { confirm } = useConfirm();
  const { showSnackbar } = useSnackbar();

  const handleDeleteUser = async (id: string) => {
    const ok = await confirm({
      message: 'Deseja realmente deletar este item?',
      TextButton1: 'Cancelar',
      TextButton2: 'Deletar',
    });

    if (ok) {
      try {
        await deleteUser(id);
        showSnackbar({ message: 'Usuário deletado com sucesso!', duration: 3000 });
      } catch {
        showSnackbar({ message: 'Erro ao deletar o usuário!', duration: 3000 });
      }
    } else {
      showSnackbar({ message: 'Ação cancelada', duration: 3000 });
    }
  };
  
  return { handleDeleteUser };
}
