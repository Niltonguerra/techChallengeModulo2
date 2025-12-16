import { useConfirm } from '@/hooks/modalConfirm/ConfirmModal';
import { useSnackbar } from '@/hooks/snackbar/snackbar';
import { deletePost } from '@/services/post';
import { useRouter } from 'expo-router';

export function useDeletePost() {
  const { confirm } = useConfirm();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  const handleDeletePost = async (id: string, returnRoute: string) => {
    const ok = await confirm({
      message: 'Deseja realmente deletar este item?',
      TextButton1: 'Cancelar',
      TextButton2: 'Deletar',
    });

    if (ok) {
      try {
        await deletePost(id);
        showSnackbar({ message: 'Item deletado com sucesso!', duration: 3000 });
        if(returnRoute) {
          router.push({// @ts-ignore 
          pathname: returnRoute
          });
        }
      } catch {
        showSnackbar({ message: 'Erro ao deletar a postagem!', duration: 3000 });
      }
    } else {
      showSnackbar({ message: 'Ação cancelada', duration: 3000 });
    }
  };
  
  return { handleDeletePost };
}
